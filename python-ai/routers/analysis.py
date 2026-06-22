"""
Analysis Router - ML-based candidate performance prediction
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import math

router = APIRouter()


class PerformanceRequest(BaseModel):
    scores: List[float]
    job_role: str
    experience: int = 0
    interview_type: str = "Mixed"


class ResumeScoreRequest(BaseModel):
    text: str
    job_role: Optional[str] = ""
    required_skills: Optional[List[str]] = []


def predict_performance(scores: list, experience: int, interview_type: str) -> dict:
    """Predict interview success probability based on scores and profile."""
    if not scores:
        return {"successProbability": 50, "recommendation": "Insufficient data"}

    avg = sum(scores) / len(scores)
    consistency = 100 - (max(scores) - min(scores))

    # Weighted score
    weighted = (avg * 0.6) + (consistency * 0.2) + (min(experience * 3, 20) * 0.2)
    probability = min(95, max(10, round(weighted)))

    # Recommendation tier
    if probability >= 80:
        recommendation = "Strong Hire — Excellent performance across categories"
    elif probability >= 65:
        recommendation = "Hire — Good performance with minor gaps"
    elif probability >= 50:
        recommendation = "Maybe — Average performance; needs improvement"
    else:
        recommendation = "Pass — Significant improvement needed before interviewing"

    # Next steps
    next_steps = []
    if avg < 60:
        next_steps.append("Focus on fundamentals and revise core concepts")
    if consistency < 70:
        next_steps.append("Work on weak areas to improve consistency")
    if experience < 2:
        next_steps.append("Build portfolio projects to compensate for limited experience")
    next_steps.append("Practice 2-3 mock interviews weekly")

    return {
        "successProbability": probability,
        "averageScore": round(avg, 1),
        "consistency": round(consistency, 1),
        "recommendation": recommendation,
        "nextSteps": next_steps,
    }


def score_resume_against_role(text: str, job_role: str, required_skills: list) -> dict:
    """Score resume relevance against a job role using keyword matching."""
    import re

    text_lower = text.lower()
    job_role_lower = job_role.lower()

    # Tech skill patterns (expand as needed)
    COMMON_SKILLS = [
        "python", "javascript", "java", "react", "node", "sql", "mongodb",
        "aws", "docker", "git", "rest", "api", "html", "css", "typescript",
        "machine learning", "deep learning", "tensorflow", "pytorch",
        "django", "flask", "fastapi", "express", "spring",
    ]

    all_skills = list(set(COMMON_SKILLS + [s.lower() for s in (required_skills or [])]))
    found_skills = [s for s in all_skills if s in text_lower]

    keyword_score = round(min(100, (len(found_skills) / max(len(all_skills), 1)) * 100 * 3))

    # Experience detection
    exp_patterns = re.findall(r'(\d+)\s*(?:\+)?\s*(?:year|yr)', text_lower)
    detected_exp = max([int(x) for x in exp_patterns], default=0) if exp_patterns else 0

    # Word count relevance
    word_count = len(text.split())
    length_score = min(100, (word_count / 300) * 100)

    # Composite
    overall = round((keyword_score * 0.5) + (length_score * 0.3) + (min(detected_exp * 10, 20)))

    missing_skills = [s for s in (required_skills or []) if s.lower() not in text_lower]

    return {
        "keywordScore": keyword_score,
        "foundSkills": found_skills,
        "missingSkills": missing_skills,
        "detectedExperience": detected_exp,
        "wordCount": word_count,
        "overallFit": min(100, overall),
    }


@router.post("/performance")
async def analyze_performance(req: PerformanceRequest):
    """Predict interview success probability from score array."""
    result = predict_performance(req.scores, req.experience, req.interview_type)
    return {"success": True, "analysis": result}


@router.post("/resume-fit")
async def analyze_resume_fit(req: ResumeScoreRequest):
    """Score how well a resume fits a target role."""
    if not req.text or len(req.text) < 50:
        raise HTTPException(status_code=400, detail="Resume text too short")

    result = score_resume_against_role(req.text, req.job_role, req.required_skills)
    return {"success": True, "fit": result}


@router.get("/test")
async def test_analysis():
    """Test the analysis service."""
    sample_scores = [75, 80, 65, 90, 70]
    result = predict_performance(sample_scores, 3, "Technical")
    return {"success": True, "sample": result}
