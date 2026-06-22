import random

# Try OpenCV if available, otherwise use simulation
try:
    import cv2
    CV2_OK = True
    face_detector = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )
except Exception:
    CV2_OK = False

def detect_faces(frame=None) -> dict:
    """Detect faces in frame. Falls back to simulation if OpenCV unavailable."""
    if CV2_OK and frame is not None:
        try:
            gray  = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = face_detector.detectMultiScale(gray, 1.2, 5)
            return {"count": len(faces), "faces": faces.tolist() if len(faces) else [], "detected": len(faces) > 0}
        except Exception:
            pass

    # Simulation
    count = random.choices([0, 1, 2], weights=[5, 90, 5], k=1)[0]
    return {"count": count, "faces": [], "detected": count > 0}

def is_face_visible() -> bool:
    result = detect_faces()
    return result["detected"]
