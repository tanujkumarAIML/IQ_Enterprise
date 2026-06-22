import random

POSTURES = {"Excellent": 95, "Good": 82, "Fair": 68, "Poor": 45}

def posture_score() -> dict:
    """Detect posture quality (simulated for non-CV mode)."""
    posture = random.choices(
        list(POSTURES.keys()),
        weights=[25, 45, 25, 5],
        k=1
    )[0]
    score = POSTURES[posture]
    return {
        "posture":      posture,
        "score":        score,
        "shoulderAlign": random.randint(80, 98),
        "headTilt":      random.randint(0, 15),
    }
