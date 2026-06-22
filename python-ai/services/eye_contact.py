import random

def eye_contact_score() -> dict:
    """Calculate eye contact score (simulated for non-CV mode)."""
    score       = random.randint(78, 97)
    gaze_time   = random.randint(60, 92)
    blink_rate  = random.randint(12, 20)
    return {
        "score":      score,
        "gazeTime":   gaze_time,
        "blinkRate":  blink_rate,
        "label":      "Excellent" if score >= 85 else "Good" if score >= 70 else "Needs Improvement",
    }
