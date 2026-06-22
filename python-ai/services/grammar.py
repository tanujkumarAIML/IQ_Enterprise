import re
import math

try:
    import textstat
    TEXTSTAT_OK = True
except ImportError:
    TEXTSTAT_OK = False

# Lazy-load heavy deps
_spell = None
def get_spell():
    global _spell
    if _spell is None:
        try:
            from spellchecker import SpellChecker
            _spell = SpellChecker()
        except Exception:
            pass
    return _spell


class GrammarAnalyzer:
    @staticmethod
    def analyze(text: str) -> dict:
        if not text or len(text.strip()) < 3:
            return {"grammarScore": 100, "grammarIssues": [], "spellingMistakes": [],
                    "readability": 60.0, "wordCount": 0, "sentenceCount": 0, "paragraphCount": 0}

        words     = re.findall(r"\b\w+\b", text.lower())
        sentences = [s.strip() for s in re.split(r"[.!?]+", text) if s.strip()]
        paras     = [p for p in text.split("\n") if p.strip()]

        issues = []

        # Capitalization check
        for s in sentences[:20]:
            if s and s[0].islower():
                issues.append(f"Sentence should start with capital letter: '{s[:40]}…'")

        # Lowercase 'i' check
        if re.search(r'\s+i\s+', text):
            issues.append("Use 'I' (capital) instead of 'i' when referring to yourself.")

        # Repetitive words
        word_freq = {}
        for w in words:
            if len(w) > 4:
                word_freq[w] = word_freq.get(w, 0) + 1
        for w, c in word_freq.items():
            if c > 5:
                issues.append(f"Word '{w}' repeated {c} times — consider synonyms.")

        # Spelling check
        spelling_mistakes = []
        spell = get_spell()
        if spell:
            unknown = spell.unknown(words[:200])
            for word in list(unknown)[:8]:
                correction = spell.correction(word)
                if correction and correction != word:
                    spelling_mistakes.append(f"'{word}' → '{correction}'")

        # Readability
        if TEXTSTAT_OK:
            try:
                readability = round(textstat.flesch_reading_ease(text), 2)
                sentence_count = textstat.sentence_count(text)
            except Exception:
                readability = 60.0
                sentence_count = len(sentences)
        else:
            readability = 60.0
            sentence_count = len(sentences)

        grammar_score = max(0, min(100, 100 - len(issues) * 3 - len(spelling_mistakes) * 2))

        return {
            "grammarScore":      grammar_score,
            "grammarIssues":     issues[:15],
            "spellingMistakes":  spelling_mistakes,
            "readability":       readability,
            "wordCount":         len(words),
            "sentenceCount":     sentence_count,
            "paragraphCount":    len(paras),
        }
