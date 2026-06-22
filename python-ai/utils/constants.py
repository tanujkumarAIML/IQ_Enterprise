"""Global constants for InterviewIQ Python AI backend."""

APP_NAME    = "InterviewIQ AI"
APP_VERSION = "3.0.0"

# Supported file types
SUPPORTED_RESUME_TYPES = [".pdf", ".doc", ".docx"]

# Interview types
INTERVIEW_TYPES = [
    "HR", "Technical", "Behavioral", "System Design", "DSA", "Mixed",
    "Java", "Python", "JavaScript", "React", "Node.js", "MongoDB", "SQL",
    "OS", "CN", "DBMS", "OOP", "Cloud", "DevOps", "AI", "ML", "DS", "Security",
]

# Company names
COMPANIES = [
    "Google", "Amazon", "Microsoft", "Meta", "Apple", "Netflix", "Adobe",
    "Uber", "Oracle", "Infosys", "TCS", "Wipro", "Accenture", "Cognizant",
    "Capgemini", "Deloitte", "IBM",
]

# Scoring weights
SCORE_WEIGHTS = {
    "technical":     0.35,
    "communication": 0.22,
    "confidence":    0.18,
    "grammar":       0.12,
    "body_language": 0.13,
}

# Gemini model
GEMINI_MODEL = "gemini-2.0-flash"

# Score labels
def score_label(score: float) -> str:
    if score >= 90: return "Outstanding"
    if score >= 80: return "Excellent"
    if score >= 70: return "Good"
    if score >= 60: return "Average"
    if score >= 50: return "Below Average"
    return "Needs Significant Improvement"
