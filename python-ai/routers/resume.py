"""
Resume Router - PDF/DOCX parsing and text extraction
"""

import io
import re
from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


def extract_pdf_text(content: bytes) -> str:
    """Extract text from PDF bytes."""
    try:
        import PyPDF2
        reader = PyPDF2.PdfReader(io.BytesIO(content))
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text.strip()
    except Exception:
        pass

    try:
        from pdfminer.high_level import extract_text_to_fp
        from pdfminer.layout import LAParams
        output = io.StringIO()
        extract_text_to_fp(io.BytesIO(content), output, laparams=LAParams())
        return output.getvalue().strip()
    except Exception:
        return ""


def extract_docx_text(content: bytes) -> str:
    """Extract text from DOCX bytes."""
    try:
        from docx import Document
        doc = Document(io.BytesIO(content))
        return "\n".join([p.text for p in doc.paragraphs]).strip()
    except Exception:
        return ""


def extract_contact_info(text: str) -> dict:
    """Extract email, phone, LinkedIn from resume text."""
    email_match = re.search(r'\b[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}\b', text)
    phone_match = re.search(r'[\+]?[\d][\d\s\-().]{8,13}[\d]', text)
    linkedin_match = re.search(r'linkedin\.com/in/[\w-]+', text)

    return {
        "email": email_match.group(0) if email_match else None,
        "phone": phone_match.group(0) if phone_match else None,
        "linkedin": linkedin_match.group(0) if linkedin_match else None,
    }


def extract_skills(text: str) -> list:
    """Extract technical skills from resume text."""
    skill_patterns = [
        # Languages
        r'\b(Python|JavaScript|TypeScript|Java|C\+\+|C#|Go|Rust|Ruby|PHP|Swift|Kotlin|Scala|R|MATLAB)\b',
        # Frontend
        r'\b(React|Vue|Angular|Next\.?js|Nuxt\.?js|Svelte|HTML|CSS|SASS|Tailwind|Bootstrap|jQuery)\b',
        # Backend
        r'\b(Node\.?js|Express|Django|Flask|FastAPI|Spring|Laravel|Rails|ASP\.NET)\b',
        # Databases
        r'\b(MongoDB|PostgreSQL|MySQL|SQLite|Redis|Cassandra|DynamoDB|Elasticsearch|Firebase)\b',
        # Cloud/DevOps
        r'\b(AWS|Azure|GCP|Docker|Kubernetes|Terraform|CI/CD|Jenkins|GitHub Actions|Ansible)\b',
        # ML/AI
        r'\b(TensorFlow|PyTorch|Scikit-learn|Pandas|NumPy|Keras|OpenCV|NLP|Machine Learning|Deep Learning)\b',
        # Tools
        r'\b(Git|Linux|REST|GraphQL|Microservices|Agile|Scrum|Jira|Figma|Postman)\b',
    ]

    skills = set()
    for pattern in skill_patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        skills.update([m.strip() for m in matches])

    return sorted(list(skills))


@router.post("/parse")
async def parse_resume(file: UploadFile = File(...)):
    """Parse uploaded PDF or DOCX resume and extract text + skills."""
    content = await file.read()
    filename = file.filename or ""

    if filename.lower().endswith(".pdf"):
        text = extract_pdf_text(content)
    elif filename.lower().endswith((".doc", ".docx")):
        text = extract_docx_text(content)
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type. Upload PDF or DOCX.")

    if not text or len(text.strip()) < 50:
        raise HTTPException(status_code=422, detail="Could not extract text from the file. Please ensure it is not a scanned image.")

    contact = extract_contact_info(text)
    skills  = extract_skills(text)

    return {
        "success": True,
        "text": text,
        "wordCount": len(text.split()),
        "contact": contact,
        "skills": skills,
    }


@router.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    """Extract raw text from PDF or DOCX (minimal response)."""
    content = await file.read()
    filename = file.filename or ""

    if filename.lower().endswith(".pdf"):
        text = extract_pdf_text(content)
    elif filename.lower().endswith((".doc", ".docx")):
        text = extract_docx_text(content)
    else:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX supported")

    return {"success": True, "text": text, "length": len(text)}
