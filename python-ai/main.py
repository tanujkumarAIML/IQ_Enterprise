"""
InterviewIQ AI — Python AI Backend v3.0
FastAPI: NLP, Resume Parsing, Interview AI, Computer Vision, Voice AI, ML
"""

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging
import os

from routers import nlp, resume, analysis, interview, vision, voice

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(
    title="InterviewIQ AI Python Backend",
    description="NLP, Resume Analysis, Interview AI, Computer Vision, Voice AI, ML Analytics",
    version="3.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.getenv("CLIENT_URL", "http://localhost:5173"),
        "http://localhost:5000",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers
app.include_router(nlp.router,       prefix="/api/nlp",       tags=["NLP"])
app.include_router(resume.router,    prefix="/api/resume",    tags=["Resume"])
app.include_router(analysis.router,  prefix="/api/analysis",  tags=["Analysis"])
app.include_router(interview.router, prefix="/api/interview",  tags=["Interview AI"])
app.include_router(vision.router,    prefix="/api/vision",    tags=["Computer Vision"])
app.include_router(voice.router,     prefix="/api/voice",     tags=["Voice AI"])

@app.get("/")
async def root():
    return {
        "success": True, "name": "InterviewIQ AI Python Backend",
        "version": "3.0.0",
        "modules": ["Resume Parser","ATS Engine","NLP","Interview AI","Computer Vision","Voice AI","ML Analytics"],
    }

@app.get("/health")
async def health():
    return {"success": True, "status": "Healthy", "gemini": bool(os.getenv("GEMINI_API_KEY"))}

@app.get("/api/status")
async def status():
    return {
        "success": True, "python": "Running",
        "resume_ai": "Ready", "nlp": "Ready", "analysis": "Ready",
        "interview_ai": "Ready", "vision_ai": "Ready", "voice_ai": "Ready",
    }

if __name__ == "__main__":
    logger.info("==========================================")
    logger.info("InterviewIQ AI Python Backend Starting...")
    logger.info("http://127.0.0.1:8000 | Docs: http://127.0.0.1:8000/docs")
    logger.info("==========================================")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
