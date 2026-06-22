import re

STRONG_WORDS  = {"developed","implemented","created","optimized","designed","led","improved",
                 "built","delivered","achieved","managed","increased","reduced","launched",
                 "established","coordinated","spearheaded","drove","enhanced","streamlined"}
WEAK_WORDS    = {"tried","maybe","perhaps","might","could","possibly","somewhat","kind of","sort of","not sure"}
ACTION_PHRASES = ["i have","i am","i can","i will","i was","i did","i built","i led"]

def confidence_score(answer: str) -> dict:
    """Calculate confidence score from answer text."""
    if not answer or not answer.strip():
        return {"score": 0, "label": "No Answer", "strongWords": 0, "weakWords": 0}

    words_lower  = answer.lower().split()
    word_set     = set(re.findall(r"\b\w+\b", answer.lower()))

    strong_count = len(word_set & STRONG_WORDS)
    weak_count   = len(word_set & WEAK_WORDS)
    action_count = sum(1 for p in ACTION_PHRASES if p in answer.lower())

    word_count = len(words_lower)

    score = 50
    score += strong_count * 6
    score += action_count * 4
    score -= weak_count   * 5
    if word_count >= 80:  score += 10
    if word_count >= 150: score += 5

    score = max(0, min(100, score))

    if score >= 80:   label = "Very Confident"
    elif score >= 65: label = "Confident"
    elif score >= 50: label = "Moderate"
    else:             label = "Lacks Confidence"

    return {"score": score, "label": label, "strongWords": strong_count, "weakWords": weak_count}
