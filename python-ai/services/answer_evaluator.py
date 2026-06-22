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

def evaluate_answer(question: str, answer: str, role: str) -> dict:
    """Evaluate a single interview answer using Gemini AI."""
    if not answer or not answer.strip():
        return {"technical": 0, "communication": 0, "confidence": 0,
                "grammar": 0, "feedback": "No answer provided.", "score": 0}

    prompt = f"""You are a Senior Technical Interviewer evaluating a {role} candidate.

Question: {question}

Answer: {answer}

Evaluate and return ONLY valid JSON with no markdown:
{{
  "technical": <0-100>,
  "communication": <0-100>,
  "confidence": <0-100>,
  "grammar": <0-100>,
  "score": <overall 0-100>,
  "feedback": "<2-3 specific sentences of feedback>",
  "betterAnswer": "<brief sample better answer>",
  "keywords": ["<key terms present or missing>"]
}}"""

    try:
        response = get_model().generate_content(prompt)
        text = response.text
        text = re.sub(r"```json\s*", "", text)
        text = re.sub(r"```\s*", "", text)
        text = text.strip()
        return json.loads(text)
    except Exception as e:
        # Fallback with heuristic scoring
        word_count = len(answer.split())
        base_score = min(70, 40 + word_count // 5)
        return {
            "technical":     base_score,
            "communication": base_score + 5,
            "confidence":    base_score - 5,
            "grammar":       base_score + 10,
            "score":         base_score,
            "feedback":      "Answer evaluated. Provide more specific details and examples.",
            "betterAnswer":  "",
            "keywords":      [],
        }
