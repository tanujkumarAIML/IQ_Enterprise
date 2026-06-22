from services.eye_contact import eye_contact_score
from services.posture_detection import posture_score
from services.emotion_detection import detect_emotion

def analyze_body_language() -> dict:
    """Aggregate body language score from sub-detectors."""
    eye     = eye_contact_score()
    posture = posture_score()
    emotion = detect_emotion()

    overall = round((eye["score"] * 0.40 + posture["score"] * 0.35 + (80 if emotion["emotion"] in ["Confident","Happy","Focused"] else 60) * 0.25))

    return {
        "overall":     overall,
        "eyeContact":  eye,
        "posture":     posture,
        "emotion":     emotion,
        "label":       "Excellent" if overall >= 85 else "Good" if overall >= 70 else "Needs Improvement",
    }
