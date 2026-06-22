import re

try:
    import textstat
    TEXTSTAT_OK = True
except ImportError:
    TEXTSTAT_OK = False

def communication_score(answer: str) -> dict:
    """Score communication quality of an answer."""
    if not answer or not answer.strip():
        return {"score": 0, "readability": 0, "words": 0, "label": "No Answer"}

    words = answer.split()
    word_count = len(words)
    sentences  = [s.strip() for s in re.split(r"[.!?]+", answer) if s.strip()]

    score = 50
    # Length bonus
    if word_count >= 100: score += 20
    elif word_count >= 60: score += 12
    elif word_count >= 30: score += 6
    elif word_count < 15:  score -= 15

    # Structure bonus
    if len(sentences) >= 3: score += 8
    if any(k in answer.lower() for k in ["firstly","secondly","furthermore","in addition","for example","such as","specifically"]):
        score += 8
    if any(k in answer.lower() for k in ["because","therefore","however","although","result","impact"]):
        score += 6

    # Filler word penalty
    fillers = ["um","uh","like","basically","literally","you know","kind of","sort of"]
    filler_count = sum(1 for w in words if w.lower() in fillers)
    score -= filler_count * 2

    score = max(0, min(100, score))

    readability = 60.0
    if TEXTSTAT_OK:
        try:
            readability = round(textstat.flesch_reading_ease(answer), 2)
        except Exception:
            pass

    if score >= 80:   label = "Excellent"
    elif score >= 65: label = "Good"
    elif score >= 50: label = "Average"
    else:             label = "Needs Improvement"

    return {"score": score, "readability": readability, "words": word_count,
            "sentences": len(sentences), "fillerWords": filler_count, "label": label}
