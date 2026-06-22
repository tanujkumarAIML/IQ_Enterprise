from services.sentiment import analyze_sentiment

def speech_sentiment(text: str) -> dict:
    """Analyze sentiment of spoken/text answer."""
    if not text or not text.strip():
        return {"polarity": 0.0, "mood": "Neutral", "score": 50, "label": "Neutral"}

    result = analyze_sentiment(text)
    # Convert 0-100 score to -1 to 1 polarity
    polarity = round((result["score"] - 50) / 50, 3)
    mood = result["label"]

    return {
        "polarity":   polarity,
        "mood":       mood,
        "score":      result["score"],
        "label":      mood,
        "positiveWords": result["positiveWords"],
        "negativeWords": result["negativeWords"],
    }
