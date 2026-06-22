from services.similarity import SimilarityService

class JobMatcher:
    @staticmethod
    def match(resume_text: str, job_description: str) -> dict:
        """Match resume to job description and return fit score."""
        if not resume_text or not job_description:
            return {"jobMatch": 0, "status": "Insufficient data", "matchedKeywords": [], "missingKeywords": []}

        # Embedding-based similarity (with text fallback)
        score = SimilarityService.embedding_similarity(resume_text, job_description)

        # Keyword overlap
        import re
        resume_words = set(re.findall(r"\b\w{4,}\b", resume_text.lower()))
        job_words    = set(re.findall(r"\b\w{4,}\b", job_description.lower()))
        matched  = list(resume_words & job_words)[:20]
        missing  = list(job_words - resume_words)[:15]

        if score >= 80:   status = "Excellent Match"
        elif score >= 65: status = "Good Match"
        elif score >= 50: status = "Moderate Match"
        else:             status = "Low Match — Improve Resume"

        return {
            "jobMatch":        round(score, 1),
            "status":          status,
            "matchedKeywords": matched,
            "missingKeywords": missing,
        }
