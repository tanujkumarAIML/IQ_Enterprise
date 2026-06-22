import re

POSITIVE = {"excellent","great","good","outstanding","strong","skilled","experienced",
            "passionate","achieved","led","built","improved","solved","delivered",
            "successfully","proficient","expert","advanced","creative","innovative",
            "motivated","dedicated","committed","reliable","efficient","productive"}
NEGATIVE = {"weak","failed","poor","bad","struggle","difficult","never","no experience",
            "lack","limited","basic","minimal","unable","unfortunately","problem","issue"}

def analyze_sentiment(text: str) -> dict:
    words = set(re.findall(r"\b\w+\b", text.lower()))
    pos   = len(words & POSITIVE)
    neg   = len(words & NEGATIVE)
    total = max(pos + neg, 1)
    score = round((pos / total) * 100)
    if score >= 65:   label = "Positive"
    elif score >= 40: label = "Neutral"
    else:             label = "Negative"
    return {"score": score, "label": label, "positiveWords": pos, "negativeWords": neg}

def get_tone(text: str) -> str:
    result = analyze_sentiment(text)
    return result["label"]
