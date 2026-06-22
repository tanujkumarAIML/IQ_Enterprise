"""Voice AI Router - speech analysis, sentiment, filler words."""

from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import Optional
import tempfile
import os

from services.speech_sentiment import speech_sentiment
from services.voice_analysis import analyze_voice_text, analyze_voice_file

router = APIRouter()

class SpeechRequest(BaseModel):
    text: str

class VoiceTextRequest(BaseModel):
    transcript: str
    job_role: Optional[str] = ""

@router.post("/sentiment")
async def sentiment(req: SpeechRequest):
    """Analyze sentiment of speech/answer text."""
    if not req.text:
        raise HTTPException(status_code=400, detail="Text required")
    return {"success": True, "result": speech_sentiment(req.text)}

@router.post("/analyze-text")
async def analyze_from_text(req: VoiceTextRequest):
    """Analyze voice characteristics from transcript."""
    if not req.transcript:
        raise HTTPException(status_code=400, detail="Transcript required")
    result = analyze_voice_text(req.transcript)
    sentiment = speech_sentiment(req.transcript)
    return {"success": True, "result": {**result, "sentiment": sentiment}}

@router.post("/analyze-file")
async def analyze_voice_audio(file: UploadFile = File(...)):
    """Analyze uploaded audio file for voice characteristics."""
    suffix = os.path.splitext(file.filename or "audio.wav")[1] or ".wav"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        result = analyze_voice_file(tmp_path)
    finally:
        os.unlink(tmp_path)

    return {"success": True, "result": result}

@router.post("/filler-words")
async def detect_filler_words(req: SpeechRequest):
    """Detect filler words in speech text."""
    fillers = ["um","uh","like","you know","basically","literally","actually","so","well","right","hmm","okay"]
    words = req.text.lower().split()
    found = [w for w in words if w.strip(".,?!") in fillers]
    ratio = round(len(found) / max(len(words), 1) * 100, 1)
    return {
        "success": True,
        "fillerWords": list(set(found)),
        "count": len(found),
        "ratio": ratio,
        "score": max(0, 100 - int(ratio * 3)),
    }
