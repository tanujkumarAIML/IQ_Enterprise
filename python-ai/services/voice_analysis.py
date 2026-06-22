import re
import random

try:
    import librosa
    import numpy as np
    LIBROSA_OK = True
except ImportError:
    LIBROSA_OK = False

def analyze_voice_file(audio_path: str) -> dict:
    """Analyze voice from audio file using librosa."""
    if not LIBROSA_OK:
        return _simulated_voice_analysis()
    try:
        y, sr = librosa.load(audio_path, sr=None)
        duration    = float(librosa.get_duration(y=y, sr=sr))
        energy      = float(np.mean(librosa.feature.rms(y=y)))
        tempo, _    = librosa.beat.beat_track(y=y, sr=sr)
        zcr         = float(np.mean(librosa.feature.zero_crossing_rate(y)))
        mfcc        = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        mfcc_mean   = float(np.mean(mfcc))

        words_per_min = int(max(80, min(200, tempo * 1.5)))
        confidence_score = min(100, int(energy * 5000 + 60))
        clarity      = max(50, min(100, int(100 - zcr * 1000)))

        return {
            "duration":       round(duration, 2),
            "energy":         round(energy, 6),
            "tempo":          round(float(tempo), 1),
            "wordsPerMin":    words_per_min,
            "confidenceScore": confidence_score,
            "clarity":        clarity,
            "mfccMean":       round(mfcc_mean, 4),
            "label":          "Confident" if confidence_score >= 75 else "Moderate" if confidence_score >= 55 else "Nervous",
        }
    except Exception:
        return _simulated_voice_analysis()

def analyze_voice_text(transcript: str) -> dict:
    """Analyze voice characteristics from transcript text."""
    if not transcript:
        return _simulated_voice_analysis()

    words = transcript.split()
    word_count = len(words)

    # Detect filler words
    fillers = ["um","uh","like","you know","basically","literally","actually","so","well","right","hmm"]
    filler_count = sum(1 for w in words if w.lower().strip(".,?!") in fillers)
    filler_ratio = round(filler_count / max(word_count, 1) * 100, 1)

    # Detect pauses (represented by "..." or "--" in transcripts)
    pause_count = transcript.count("...") + transcript.count("--")

    # Speaking speed estimate
    sentences = [s for s in re.split(r"[.!?]+", transcript) if s.strip()]
    avg_words_per_sentence = word_count / max(len(sentences), 1)

    clarity_score = max(40, min(100, 100 - filler_ratio * 3 - pause_count * 2))
    confidence_score = max(40, min(100, 80 - filler_ratio * 2 - pause_count))

    return {
        "wordCount":       word_count,
        "fillerWords":     filler_count,
        "fillerRatio":     filler_ratio,
        "pauseCount":      pause_count,
        "avgWordsPerSentence": round(avg_words_per_sentence, 1),
        "clarityScore":    clarity_score,
        "confidenceScore": confidence_score,
        "label":           "Confident" if confidence_score >= 75 else "Moderate" if confidence_score >= 55 else "Nervous",
    }

def _simulated_voice_analysis() -> dict:
    """Return simulated voice analysis for demo mode."""
    confidence = random.randint(68, 95)
    return {
        "duration":        random.uniform(30, 120),
        "energy":          round(random.uniform(0.01, 0.08), 6),
        "wordsPerMin":     random.randint(110, 170),
        "confidenceScore": confidence,
        "clarity":         random.randint(70, 95),
        "fillerWords":     random.randint(0, 8),
        "label":           "Confident" if confidence >= 75 else "Moderate",
    }
