from services.keywords import KeywordExtractor
from services.grammar import GrammarAnalyzer
import re

class ATSAnalyzer:
    @staticmethod
    def calculate(text: str, job_role: str = "") -> dict:
        """Full ATS analysis of resume text."""
        if not text or len(text.strip()) < 30:
            return {"atsScore": 0, "error": "Text too short"}

        skills   = KeywordExtractor.extract(text)
        grammar  = GrammarAnalyzer.analyze(text)
        skill_names = [s["skill"] for s in skills]

        keyword_score = min(100, len(skills) * 4)
        grammar_score = grammar["grammarScore"]

        # Formatting score heuristics
        has_sections  = any(k in text.lower() for k in ["experience","education","skills","projects","summary","objective"])
        has_bullets   = bool(re.search(r"[•\-\*]", text))
        has_dates     = bool(re.search(r"\b(20\d{2}|19\d{2})\b", text))
        has_contact   = bool(re.search(r"[\w.+-]+@[\w-]+\.\w+", text))
        word_count    = len(text.split())

        formatting_score = 50
        if has_sections:   formatting_score += 15
        if has_bullets:    formatting_score += 10
        if has_dates:      formatting_score += 10
        if has_contact:    formatting_score += 10
        if word_count >= 300: formatting_score += 5
        formatting_score = min(100, formatting_score)

        ats_score = round(keyword_score * 0.45 + grammar_score * 0.25 + formatting_score * 0.30)

        missing = KeywordExtractor.get_missing(skill_names, job_role)

        return {
            "atsScore":        ats_score,
            "keywordScore":    keyword_score,
            "grammarScore":    grammar_score,
            "formattingScore": formatting_score,
            "extractedSkills": skill_names,
            "missingSkills":   missing,
            "grammarIssues":   grammar.get("grammarIssues", []),
            "wordCount":       word_count,
            "hasContact":      has_contact,
            "hasSections":     has_sections,
        }
