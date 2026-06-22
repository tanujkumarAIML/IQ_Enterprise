"""Interview AI Router - question generation, answer evaluation, reports."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from services.question_generator import generate_questions
from services.answer_evaluator   import evaluate_answer
from services.communication      import communication_score
from services.confidence         import confidence_score
from services.report             import generate_report
from services.report_generator   import generate_full_report

router = APIRouter()

class QuestionRequest(BaseModel):
    jobRole:       str
    experience:    int = 0
    difficulty:    str = "Medium"
    interviewType: str = "Mixed"
    company:       str = ""

class AnswerRequest(BaseModel):
    question: str
    answer:   str
    role:     str

class FullEvalRequest(BaseModel):
    answers: list    # List of {question, answer, role}
    job_role: Optional[str] = ""
    experience: Optional[int] = 0

class ReportRequest(BaseModel):
    answers:   list
    job_role:  Optional[str] = ""
    experience: Optional[int] = 0

@router.post("/questions")
async def create_questions(data: QuestionRequest):
    """Generate AI interview questions."""
    if not data.jobRole:
        raise HTTPException(status_code=400, detail="jobRole is required")
    questions = generate_questions(data.jobRole, data.experience, data.difficulty, data.interviewType, data.company)
    return {"success": True, "questions": questions, "count": len(questions)}

@router.post("/evaluate")
async def evaluate(data: AnswerRequest):
    """Evaluate a single interview answer."""
    if not data.answer or not data.answer.strip():
        return {"success": True, "result": {"technical": 0, "communication": 0, "confidence": 0, "grammar": 0, "score": 0, "feedback": "No answer provided."}}
    result = evaluate_answer(data.question, data.answer, data.role)
    return {"success": True, "result": result}

@router.post("/evaluate-all")
async def evaluate_all(data: FullEvalRequest):
    """Evaluate all answers in one batch."""
    if not data.answers:
        raise HTTPException(status_code=400, detail="answers list required")
    results = []
    for item in data.answers:
        r = evaluate_answer(item.get("question",""), item.get("answer",""), data.job_role or item.get("role","developer"))
        results.append(r)
    report = generate_full_report(results, data.job_role, data.experience)
    return {"success": True, "results": results, "report": report}

@router.post("/communication")
async def communication(data: AnswerRequest):
    """Analyze communication quality of an answer."""
    return {"success": True, "communication": communication_score(data.answer)}

@router.post("/confidence")
async def confidence(data: AnswerRequest):
    """Analyze confidence in an answer."""
    return {"success": True, "confidence": confidence_score(data.answer)}

@router.post("/report")
async def report(data: ReportRequest):
    """Generate full interview report."""
    if not data.answers:
        raise HTTPException(status_code=400, detail="answers required")
    result = generate_full_report(data.answers, data.job_role, data.experience)
    return {"success": True, "report": result}
