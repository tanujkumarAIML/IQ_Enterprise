def calculate_ml_score(technical: float, communication: float,
                        confidence: float, body: float,
                        grammar: float = 70, experience: int = 0) -> dict:
    """Calculate weighted ML hiring probability score."""
    weighted = (
        technical     * 0.35 +
        communication * 0.22 +
        confidence    * 0.18 +
        grammar       * 0.12 +
        body          * 0.13
    )
    exp_bonus = min(experience * 1.5, 12)
    overall   = min(99, int(weighted + exp_bonus))

    if overall >= 85:   recommendation = "Strong Hire"
    elif overall >= 72: recommendation = "Hire"
    elif overall >= 58: recommendation = "Maybe"
    else:               recommendation = "Pass"

    return {
        "overall":           overall,
        "hiringProbability": overall,
        "recommendation":    recommendation,
        "breakdown": {
            "technical":     technical,
            "communication": communication,
            "confidence":    confidence,
            "grammar":       grammar,
            "bodyLanguage":  body,
        },
    }
