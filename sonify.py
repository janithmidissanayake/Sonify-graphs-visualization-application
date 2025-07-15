import os
import cv2
import json
import numpy as np
import joblib
import warnings
from gtts import gTTS
from pydub import AudioSegment
from pydub.generators import Sine
from scipy.signal import savgol_filter
from scipy.integrate import trapezoid
from numpy.polynomial import Polynomial
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score

warnings.filterwarnings("ignore", category=RuntimeWarning)

square_model_path = os.path.join("model", "square_rf_model.pkl")
square_model = joblib.load(square_model_path)

manual_wav_path_up = os.path.join("static", "concave_up.wav")
manual_wav_path_down = os.path.join("static", "concave_down.wav")
manual_wav_path_linear_up = os.path.join("static", "y_equals_x_increasing.wav")
manual_wav_path_linear_down = os.path.join("static", "y_equals_neg_x_decreasing.wav")

def enhance_graph_image(image_path):
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    img = cv2.resize(img, (256, 256))
    img = cv2.equalizeHist(img)
    blurred = cv2.GaussianBlur(img, (3, 3), 0)
    binary = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_MEAN_C,
                                   cv2.THRESH_BINARY_INV, 11, 2)
    morph = cv2.morphologyEx(binary, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    morph = cv2.morphologyEx(morph, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
    skeleton = morph > 0
    return np.uint8(skeleton) * 255, 128

def extract_graph_points(skel_img, x_axis_row):
    points = np.column_stack(np.where(skel_img > 0))[:, [1, 0]]
    points = points[points[:, 0].argsort()].astype(np.float64)
    points[:, 1] = -(points[:, 1] - x_axis_row)
    y_range = max(abs(points[:, 1].min()), abs(points[:, 1].max())) or 128
    points[:, 1] = (points[:, 1] / y_range) * 128
    return points

def normalize_points(points):
    return np.flip(points, axis=0) if points[0][0] > points[-1][0] else points

def apply_savgol(points):
    if len(points) >= 11:
        y_smooth = savgol_filter(points[:, 1], 11, 2)
        return np.column_stack((points[:, 0], y_smooth))
    return points

def detect_intercepts(points, graph_type):
    x, y = points[:, 0], points[:, 1]
    try:
        if graph_type == "square":
            coeffs = np.polyfit(x, y, 2)
            a, b, c = coeffs
            disc = b**2 - 4*a*c
            if disc >= 0:
                r1 = (-b + np.sqrt(disc)) / (2 * a)
                r2 = (-b - np.sqrt(disc)) / (2 * a)
                x_intercept = (r1 + r2) / 2
            else:
                x_intercept = None
            y_intercept = (0, np.polyval(coeffs, 0))
        else:
            p = np.polyfit(x, y, 1)
            y_intercept = (0, np.polyval(p, 0))
            x_intercept = -p[1]/p[0] if p[0] != 0 else None
        return x_intercept, y_intercept
    except:
        return None, None

def generate_chime(intercept_type):
    freq = 1200 if intercept_type == 'x' else 1500
    return Sine(freq).to_audio_segment(duration=200)

def generate_intro_tts(text, filename):
    tts = gTTS(text)
    tts.save(filename)

def add_chimes(audio, intercepts, duration_ms, base_gain=0):
    chime_overlay = audio
    boost = max(0, -base_gain) + 4
    if intercepts[0]:
        chime_overlay = chime_overlay.overlay(generate_chime('x').apply_gain(boost), position=int(duration_ms*0.45))
    if intercepts[1]:
        chime_overlay = chime_overlay.overlay(generate_chime('y').apply_gain(boost), position=int(duration_ms*0.05))
    return chime_overlay

def predict_trend(features, graph_type):
    if graph_type == "linear":
        slope = features.get("slope", 0.0)
        return "increasing" if slope > 0.03 else "decreasing" if slope < -0.03 else "flat"
    elif graph_type == "square":
        sample = [features.get(k, 0.0) for k in ["slope", "second_derivative", "r2", "enclosed_area", "vertex_y", "edge_avg_y"]]
        return "concave_up" if square_model.predict([sample])[0] == 1 else "concave_down"
    return "unknown"

def process_graph_file(img_path, output_dir):
    skel_img, x_row = enhance_graph_image(img_path)
    pts = extract_graph_points(skel_img, x_row)
    pts = normalize_points(pts)
    pts = apply_savgol(pts)

    graph_type = "square" if "_s" in img_path else "linear"
    x, y = pts[:, 0], pts[:, 1]
    reg = LinearRegression().fit(x.reshape(-1, 1), y)
    slope = float(reg.coef_[0])
    enclosed_area = float(trapezoid(y, x))
    vertex_y, edge_avg_y = 0.0, 0.0

    if graph_type == "square" and len(pts) >= 15:
        p = Polynomial.fit(x, y, 2).convert()
        vertex_x = -p.coef[1] / (2 * p.coef[2]) if p.coef[2] != 0 else np.mean(x)
        vertex_y = float(p(vertex_x))
        edge_ys = [float(p(xi)) for xi in np.concatenate((x[:3], x[-3:]))]
        edge_avg_y = float(np.mean(edge_ys))
        y_fit = p(x)
        r2 = r2_score(y, y_fit)
        enclosed_area = float(trapezoid(y_fit, x))
        second_derivative = 2 * p.coef[2]
    else:
        r2 = r2_score(y, reg.predict(x.reshape(-1, 1)))
        second_derivative = 0.0

    features = {
        "slope": slope,
        "second_derivative": second_derivative,
        "r2": r2,
        "enclosed_area": enclosed_area,
        "vertex_y": vertex_y,
        "edge_avg_y": edge_avg_y
    }

    trend = predict_trend(features, graph_type)
    x_intercept, y_intercept = detect_intercepts(pts, graph_type)

    if trend == "concave_up":
        audio_path = manual_wav_path_up
    elif trend == "concave_down":
        audio_path = manual_wav_path_down
    elif trend == "increasing":
        audio_path = manual_wav_path_linear_up
    elif trend == "decreasing":
        audio_path = manual_wav_path_linear_down
    else:
        raise ValueError("Unsupported trend")

    graph_audio = AudioSegment.from_file(audio_path)
    abs_slope = abs(slope)
    min_slope, max_slope = 0.001, 0.1
    gain = -25 if abs_slope <= min_slope else 8 if abs_slope >= max_slope else -25 + ((abs_slope - min_slope) / (max_slope - min_slope)) * (8 + 25)
    graph_audio = graph_audio.apply_gain(gain)

    final_audio = add_chimes(graph_audio, (x_intercept, y_intercept), len(graph_audio), gain)

    intro_text = f"Graph {os.path.basename(img_path)}. This is a {graph_type} graph. It is {trend}."
    if y_intercept:
        intro_text += f" It crosses the y-axis at approximately y = {y_intercept[1]:.1f}."
    if x_intercept:
        intro_text += f" It crosses the x-axis at approximately x = {x_intercept:.1f}."

    tts_filename = os.path.join(output_dir, "tts_temp.mp3")
    generate_intro_tts(intro_text, tts_filename)
    tts_audio = AudioSegment.from_file(tts_filename).apply_gain(-6)
    os.remove(tts_filename)

    final_audio += tts_audio
    output_filename = f"sonified_{os.path.basename(img_path).split('.')[0]}.wav"
    output_path = os.path.join(output_dir, output_filename)
    final_audio.export(output_path, format="wav")

    return output_filename, {"trend": trend, "graph_type": graph_type, "x_intercept": x_intercept, "y_intercept": y_intercept}
