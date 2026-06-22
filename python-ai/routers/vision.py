"""Computer Vision Router - body language, face detection, emotion, eye contact."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from services.body_language  import analyze_body_language
from services.eye_contact    import eye_contact_score
from services.emotion_detection import detect_emotion, detect_emotion_from_text
from services.face_detection import detect_faces
from services.posture_detection import posture_score

router = APIRouter()

class TextAnalysisRequest(BaseModel):
    text: str

@router.get("/body")
async def body_language():
    """Get body language analysis (camera-based simulation)."""
    return {"success": True, "result": analyze_body_language()}

@router.get("/eye-contact")
async def eye_contact():
    """Get eye contact score."""
    return {"success": True, "result": eye_contact_score()}

@router.get("/emotion")
async def emotion():
    """Get current emotion detection result."""
    return {"success": True, "result": detect_emotion()}

@router.post("/emotion-from-text")
async def emotion_from_text(req: TextAnalysisRequest):
    """Detect emotion from answer text."""
    if not req.text:
        raise HTTPException(status_code=400, detail="Text required")
    return {"success": True, "result": detect_emotion_from_text(req.text)}

@router.get("/face")
async def face():
    """Get face detection result."""
    return {"success": True, "result": detect_faces()}

@router.get("/posture")
async def posture():
    """Get posture score."""
    return {"success": True, "result": posture_score()}

@router.get("/full-analysis")
async def full_vision_analysis():
    """Complete vision analysis in one call."""
    body    = analyze_body_language()
    return {
        "success": True,
        "analysis": {
            "bodyLanguage":  body,
            "eyeContact":    body["eyeContact"],
            "emotion":       body["emotion"],
            "posture":       body["posture"],
            "overallScore":  body["overall"],
        }
    }
