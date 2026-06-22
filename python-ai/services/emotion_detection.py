import random
import re

EMOTIONS = ["Happy", "Neutral", "Focused", "Confident", "Anxious", "Surprised"]

def detect_emotion_from_text(text: str) -> dict:
    """Detect emotion from answer text using sentiment heuristics."""
    positive_words = {"happy","great","excellent","confident","excited","enthusiastic","proud","love","enjoy"}
    anxious_words  = {"nervous","worried","difficult","struggle","challenge","unsure","confused","doubt"}
    text_lower = text.lower()
    words = set(re.findall(r"\b\w+\b", text_lower))

    pos_count = len(words & positive_words)
    anx_count = len(words & anxious_words)

    if pos_count > anx_count:
        emotion, confidence = "Confident", min(95, 70 + pos_count * 5)
    elif anx_count > pos_count:
        emotion, confidence = "Anxious", min(90, 60 + anx_count * 5)
    else:
        emotion, confidence = "Neutral", random.randint(72, 88)

    return {"emotion": emotion, "confidence": confidence, "allEmotions": {e: random.randint(5, 30) for e in EMOTIONS}}

def detect_emotion() -> dict:
    """Simulated real-time emotion detection (for demo/non-CV mode)."""
    emotion = random.choices(
        EMOTIONS,
        weights=[20, 35, 25, 15, 3, 2],
        k=1
    )[0]
    confidence = random.randint(75, 97)
    return {"emotion": emotion, "confidence": confidence}
