import joblib
import os

square_model = joblib.load("graph_output/square_rf_model.pkl")

static_paths = {
    "concave_up": "app/static/concave_up.wav",
    "concave_down": "app/static/concave_down.wav",
    "increasing": "app/static/y_equals_x_increasing.wav",
    "decreasing": "app/static/y_equals_neg_x_decreasing.wav"
}
