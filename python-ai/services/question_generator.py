"""
Question Generator — Gemini AI (resume-aware, no pre-loaded bank)
All questions generated live based on candidate profile + resume.
"""
import os
import json
import re

import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY", ""))
_model = None

def get_model():
    global _model
    if _model is None:
        _model = genai.GenerativeModel("gemini-2.0-flash")
    return _model


def generate_questions(
    role: str,
    experience: int = 0,
    difficulty: str = "Medium",
    interview_type: str = "Mixed",
    company: str = "",
    resume_text: str = "",
    skills: list = None,
    count: int = 10,
) -> list:
    """
    Generate interview questions 100% from Gemini AI.
    Uses resume text and skills for personalized, role-specific questions.
    """
    skills = skills or []
    company_ctx  = f"Target Company: {company}"            if company     else ""
    skill_ctx    = f"Candidate Skills: {', '.join(skills[:20])}" if skills else ""
    resume_ctx   = f'\nResume (first 1500 chars):\n"""\n{resume_text[:1500]}\n"""' if resume_text else ""

    prompt = f"""You are a Senior Technical Interviewer at a top-tier company.

Generate exactly {count} UNIQUE, TAILORED interview questions for this specific candidate.

─── CANDIDATE PROFILE ─────────────────────────────────
Role:           {role}
Experience:     {experience} year{"s" if experience != 1 else ""}
Interview Type: {interview_type}
Difficulty:     {difficulty}
{company_ctx}
{skill_ctx}
{resume_ctx}

─── STRICT RULES ──────────────────────────────────────
1. Return ONLY a valid JSON array of {count} strings — no explanation, no markdown.
2. Questions MUST be personalized to the candidate's skills and experience.
3. If resume is provided, ask about specific projects and technologies mentioned.
4. Difficulty levels:
   - Easy:   Basic concepts, foundational knowledge
   - Medium: Scenario-based, problem-solving, deeper dives
   - Hard:   System design, architecture trade-offs, complex algorithms
5. Interview type focus:
   - Technical:     Programming concepts, debugging, code optimization
   - DSA:           Algorithms, data structures, complexity analysis
   - System Design: Scalability, distributed systems, architecture
   - Behavioral/HR: STAR-method situational questions about past experiences
   - Mixed:         Balanced blend of all types
6. NO generic fillers. Every question must add value.
7. Zero duplicate questions.

Format: ["Question 1?", "Question 2?", ..., "Question {count}?"]"""

    try:
        response = get_model().generate_content(prompt)
        text = response.text
        # Strip markdown
        text = re.sub(r"```json\s*", "", text)
        text = re.sub(r"```\s*", "", text).strip()

        parsed = json.loads(text)
        if isinstance(parsed, list) and len(parsed) >= 3:
            return [str(q) for q in parsed[:count]]

    except Exception as e:
        pass

    # Line-by-line fallback extraction
    try:
        lines = response.text.split("\n")
        questions = []
        for line in lines:
            line = re.sub(r"^\d+[.)]\s*", "", line).strip().strip('"').strip("'")
            if line and len(line) > 15 and ("?" in line or len(line) > 30):
                questions.append(line)
        if questions:
            return questions[:count]
    except Exception:
        pass

    # Last resort: re-prompt with simpler format
    try:
        simple_prompt = f"List {count} interview questions for a {difficulty} {interview_type} interview for {role} with {experience} years experience. Format: numbered list."
        response2 = get_model().generate_content(simple_prompt)
        lines = [
            re.sub(r"^\d+[.)]\s*", "", l).strip()
            for l in response2.text.split("\n")
            if l.strip() and len(l.strip()) > 10
        ]
        if lines:
            return lines[:count]
    except Exception:
        pass

    raise RuntimeError(f"Gemini failed to generate questions for role: {role}. Check GEMINI_API_KEY.")
