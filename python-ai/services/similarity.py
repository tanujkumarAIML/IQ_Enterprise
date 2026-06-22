import re
import numpy as np

class SimilarityService:
    @staticmethod
    def cosine_similarity(vec1: list, vec2: list) -> float:
        """Cosine similarity between two vectors (0-100 scale)."""
        if not vec1 or not vec2:
            return 0.0
        v1 = np.array(vec1[:min(len(vec1), len(vec2))])
        v2 = np.array(vec2[:min(len(vec1), len(vec2))])
        norm1, norm2 = np.linalg.norm(v1), np.linalg.norm(v2)
        if norm1 == 0 or norm2 == 0:
            return 0.0
        return round(float(np.dot(v1, v2) / (norm1 * norm2)) * 100, 2)

    @staticmethod
    def text_similarity(text1: str, text2: str) -> float:
        """Jaccard similarity between two text strings."""
        if not text1 or not text2:
            return 0.0
        words1 = set(re.findall(r"\b\w+\b", text1.lower()))
        words2 = set(re.findall(r"\b\w+\b", text2.lower()))
        if not words1 or not words2:
            return 0.0
        intersection = words1 & words2
        union = words1 | words2
        return round(len(intersection) / len(union) * 100, 2)

    @staticmethod
    def embedding_similarity(text1: str, text2: str) -> float:
        """Similarity using sentence embeddings if available."""
        try:
            from services.embeddings import EmbeddingService
            v1 = EmbeddingService.encode(text1)
            v2 = EmbeddingService.encode(text2)
            return SimilarityService.cosine_similarity(v1, v2)
        except Exception:
            return SimilarityService.text_similarity(text1, text2)
