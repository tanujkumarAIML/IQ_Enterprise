import io
import re

def extract_pdf_text(content: bytes) -> str:
    """Extract text from PDF bytes with multiple fallbacks."""
    # Try PyMuPDF first (fastest)
    try:
        import fitz
        pdf  = fitz.open(stream=content, filetype="pdf")
        text = "".join(page.get_text() for page in pdf)
        pdf.close()
        if text.strip():
            return text.strip()
    except Exception:
        pass

    # Try PyPDF2
    try:
        import PyPDF2
        reader = PyPDF2.PdfReader(io.BytesIO(content))
        text = "".join(page.extract_text() or "" for page in reader.pages)
        if text.strip():
            return text.strip()
    except Exception:
        pass

    # Try pdfminer
    try:
        from pdfminer.high_level import extract_text_to_fp
        from pdfminer.layout import LAParams
        output = io.StringIO()
        extract_text_to_fp(io.BytesIO(content), output, laparams=LAParams())
        text = output.getvalue()
        if text.strip():
            return text.strip()
    except Exception:
        pass

    return ""

def extract_docx_text(content: bytes) -> str:
    """Extract text from DOCX bytes."""
    try:
        from docx import Document
        doc = Document(io.BytesIO(content))
        return "\n".join(p.text for p in doc.paragraphs if p.text.strip())
    except Exception:
        return ""

def clean_text(text: str) -> str:
    """Clean extracted resume text."""
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()

class ResumeParser:
    @staticmethod
    def extract_pdf_text(file_path: str) -> str:
        with open(file_path, "rb") as f:
            return extract_pdf_text(f.read())

    @staticmethod
    def extract_docx_text(file_path: str) -> str:
        with open(file_path, "rb") as f:
            return extract_docx_text(f.read())

    @staticmethod
    def clean_text(text: str) -> str:
        return clean_text(text)
