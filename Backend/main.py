from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil

# Import your graph processing logic
from sonify import process_graph_file

app = FastAPI()

# Allow requests from frontend (React at localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories
UPLOAD_DIR = "uploads"
OUTPUT_DIR = "outputs"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    # Validate file type
    if not file.filename.lower().endswith((".png", ".jpg", ".jpeg")):
        raise HTTPException(status_code=400, detail="Only image files (.png, .jpg, .jpeg) are supported")

    # Save file
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # Run processing
        (graph_audio_path, tts_audio_path), metadata = process_graph_file(file_path, OUTPUT_DIR)

        return JSONResponse({
            "graph_audio": os.path.basename(graph_audio_path),
            "voice_audio": os.path.basename(tts_audio_path),
            "metadata": metadata
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")


@app.get("/download/{filename}")
def download_audio(filename: str):
    file_path = os.path.join(OUTPUT_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Audio file not found")

    # Detect content type based on extension
    if filename.endswith(".mp3"):
        media_type = "audio/mpeg"
    elif filename.endswith(".wav"):
        media_type = "audio/wav"
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    return FileResponse(path=file_path, media_type=media_type, filename=filename)

