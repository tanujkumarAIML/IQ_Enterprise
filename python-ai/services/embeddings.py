import numpy as np

_model = None

def get_model():
    global _model
    if _model is None:
        try:
            from sentence_transformers import SentenceTransformer
            _model = SentenceTransformer("all-MiniLM-L6-v2")
        except Exception:
            _model = None
    return _model

class EmbeddingService:
    @staticmethod
    def encode(text: str) -> list:
        if not text:
            return []
        model = get_model()
        if model is None:
            # Fallback: simple TF-IDF-like vector
            import hashlib
            words = text.lower().split()[:50]
            vec = [int(hashlib.md5(w.encode()).hexdigest()[:4], 16) / 65535 for w in words]
            return vec[:32]
        embedding = model.encode(text, convert_to_numpy=True, normalize_embeddings=True)
        return embedding.tolist()

    @staticmethod
    def encode_batch(texts: list) -> list:
        if not texts:
            return []
        model = get_model()
        if model is None:
            return [EmbeddingService.encode(t) for t in texts]
        embeddings = model.encode(texts, convert_to_numpy=True, normalize_embeddings=True)
        return embeddings.tolist()
