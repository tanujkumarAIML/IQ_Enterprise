"""
NLP Router - Text analysis, grammar, sentiment, keyword extraction
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import re

router = APIRouter()


class TextRequest(BaseModel):
    text: str
    reference: Optional[str] = None


class AnswerAnalysisRequest(BaseModel):
    question: str
    answer: str
    job_role: Optional[str] = "Software Developer"


# ── Lazy-load NLP models ─────────────────────────────────────
_nlp = None
_spell = None


def get_nlp():
    global _nlp
    if _nlp is None:
        try:
            import spacy
            _nlp = spacy.load("en_core_web_sm")
        except Exception:
            _nlp = None
    return _nlp


def get_spell():
    global _spell
    if _spell is None:
        try:
            from spellchecker import SpellChecker
            _spell = SpellChecker()
        except Exception:
            _spell = None
    return _spell


def extract_keywords(text: str) -> List[str]:
    """Extract meaningful keywords from text using spaCy NER + noun chunks."""
    nlp = get_nlp()
    if not nlp:
        # Fallback: simple word frequency
        words = re.findall(r'\b[A-Za-z][a-z]+\b', text)
        stop = {"the","a","an","in","of","for","and","or","to","is","are","was","were","with","at","by","from"}
        return list({w.lower() for w in words if w.lower() not in stop})[:20]

    doc = nlp(text[:5000])
    keywords = set()

    # Named entities
    for ent in doc.ents:
        if ent.label_ in {"ORG", "PRODUCT", "GPE", "SKILL", "WORK_OF_ART"}:
            keywords.add(ent.text.lower())

    # Noun chunks
    for chunk in doc.noun_chunks:
        if len(chunk.text.split()) <= 3:
            keywords.add(chunk.text.lower())

    return list(keywords)[:30]


def grammar_check(text: str) -> List[str]:
    """Return list of grammar issues (basic heuristics)."""
    issues = []
    sentences = re.split(r'[.!?]+', text)
    for s in sentences:
        s = s.strip()
        if not s:
            continue
        if s and s[0].islower():
            issues.append(f"Sentence should start with capital: '{s[:50]}…'")
        if re.search(r'\b(i)\b(?!\s*[.!?])', s):
            issues.append(f"Use 'I' instead of 'i' in: '{s[:50]}'")

    spell = get_spell()
    if spell:
        words = re.findall(r'\b[a-zA-Z]+\b', text)
        misspelled = spell.unknown(words[:200])
        for word in list(misspelled)[:5]:
            correction = spell.correction(word)
            if correction and correction != word:
                issues.append(f"Possible misspelling: '{word}' → '{correction}'")

    return issues[:10]


def sentiment_score(text: str) -> dict:
    """Basic sentiment analysis (positive/negative word count)."""
    positive_words = {"good","great","excellent","strong","experienced","skilled","passionate",
                      "achieved","led","built","improved","solved","delivered","successfully"}
    negative_words = {"weak","failed","poor","bad","struggle","difficult","never","no experience"}

    words = set(re.findall(r'\b\w+\b', text.lower()))
    pos = len(words & positive_words)
    neg = len(words & negative_words)
    total = max(pos + neg, 1)

    score = round((pos / total) * 100)
    label = "Positive" if score >= 60 else "Neutral" if score >= 40 else "Negative"

    return {"score": score, "label": label, "positive": pos, "negative": neg}


def communication_score(text: str) -> int:
    """Score communication quality based on several heuristics."""
    score = 50

    word_count = len(text.split())
    if word_count >= 80:  score += 15
    elif word_count >= 40: score += 8
    elif word_count < 20:  score -= 15

    sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
    if len(sentences) >= 3: score += 10

    # Structural signals
    if any(kw in text.lower() for kw in ["firstly", "secondly", "furthermore", "in addition", "for example", "such as"]):
        score += 10

    issues = grammar_check(text)
    score -= len(issues) * 3

    return max(0, min(100, score))


@router.post("/analyze")
async def analyze_text(req: AnswerAnalysisRequest):
    """Full NLP analysis of an interview answer."""
    if not req.answer or len(req.answer.strip()) < 5:
        raise HTTPException(status_code=400, detail="Answer text too short")

    keywords  = extract_keywords(req.answer)
    grammar   = grammar_check(req.answer)
    sentiment = sentiment_score(req.answer)
    comm_score = communication_score(req.answer)
    word_count = len(req.answer.split())

    return {
        "success": True,
        "analysis": {
            "keywords": keywords,
            "grammarIssues": grammar,
            "sentiment": sentiment,
            "communicationScore": comm_score,
            "wordCount": word_count,
            "avgWordsPerSentence": round(word_count / max(len(re.split(r'[.!?]+', req.answer)), 1), 1),
        },
    }


@router.post("/keywords")
async def extract_keywords_route(req: TextRequest):
    """Extract keywords from text."""
    keywords = extract_keywords(req.text)
    return {"success": True, "keywords": keywords}


@router.post("/grammar")
async def check_grammar(req: TextRequest):
    """Check grammar in text."""
    issues = grammar_check(req.text)
    return {"success": True, "issues": issues, "score": max(0, 100 - len(issues) * 10)}


@router.post("/sentiment")
async def analyze_sentiment(req: TextRequest):
    """Analyze sentiment of text."""
    result = sentiment_score(req.text)
    return {"success": True, "sentiment": result}
