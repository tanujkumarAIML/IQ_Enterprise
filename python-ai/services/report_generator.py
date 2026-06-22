"""Full interview report generator - aggregates all sub-scores."""

def generate_full_report(answers_data: list, job_role: str = "", experience: int = 0) -> dict:
    """
    Generate a comprehensive interview report from a list of evaluated answers.

    Each item in answers_data should have:
      technical, communication, confidence, grammar, feedback
    """
    if not answers_data:
        return {"error": "No answers provided"}

    n = len(answers_data)

    def avg(key): return round(sum(a.get(key, 0) for a in answers_data) / n, 1)

    technical     = avg("technical")
    communication = avg("communication")
    confidence    = avg("confidence")
    grammar       = avg("grammar")
    overall       = round(technical * 0.4 + communication * 0.25 + confidence * 0.2 + grammar * 0.15, 1)

    if overall >= 85:
        recommendation = "Strong Hire"
        summary = f"Outstanding performance for {job_role or 'the role'}. Candidate shows excellent command across all areas."
    elif overall >= 72:
        recommendation = "Hire"
        summary = f"Good overall performance. Minor gaps exist but candidate is suitable for {job_role or 'the role'}."
    elif overall >= 58:
        recommendation = "Maybe"
        summary = "Average performance. Recommend additional practice before final interview."
    else:
        recommendation = "Pass"
        summary = "Below average performance. Significant improvement needed."

    # Strengths and weaknesses from answer feedback
    all_feedback = [a.get("feedback", "") for a in answers_data if a.get("feedback")]

    return {
        "overallScore":       overall,
        "technicalScore":     technical,
        "communicationScore": communication,
        "confidenceScore":    confidence,
        "grammarScore":       grammar,
        "recommendation":     recommendation,
        "summary":            summary,
        "totalAnswers":       n,
        "feedback":           all_feedback,
        "hiringProbability":  min(99, int(overall)),
    }
