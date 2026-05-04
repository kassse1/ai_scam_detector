from fastapi import FastAPI
from pydantic import BaseModel
import joblib
from transformers import pipeline
from fastapi.middleware.cors import CORSMiddleware
import json
import os
import time
import subprocess
import pandas as pd
from pathlib import Path


# ===== PATHS =====
BASE_DIR = Path(__file__).resolve().parents[2]

SCAM_MODEL_PATH = BASE_DIR / "ml" / "classical" / "scam_model.pkl"
SCAM_VECTORIZER_PATH = BASE_DIR / "ml" / "classical" / "vectorizer.pkl"

TRANSFORMER_PATH = BASE_DIR / "ml" / "transformer" / "scam_transformer"

FEEDBACK_PATH = BASE_DIR / "data" / "processed" / "feedback_data.jsonl"
RETRAIN_SCRIPT_PATH = BASE_DIR / "backend" / "app" / "services" / "retraining.py"


app = FastAPI(title="AI Scam Detector API")


# ===== CORS =====
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ===== LOAD MODELS =====
scam_model = joblib.load(SCAM_MODEL_PATH)
scam_vectorizer = joblib.load(SCAM_VECTORIZER_PATH)

ai_detector = pipeline(
    "text-classification",
    model="roberta-base-openai-detector"
)

transformer = pipeline(
    "text-classification",
    model=str(TRANSFORMER_PATH),
    tokenizer=str(TRANSFORMER_PATH)
)

last_loaded = os.path.getmtime(SCAM_MODEL_PATH)


# ===== SCHEMAS =====
class Message(BaseModel):
    text: str


class Feedback(BaseModel):
    text: str
    correct_label: str  # SCAM / SAFE


# ===== HELPERS =====
def reload_model_if_updated():
    global scam_model, scam_vectorizer, last_loaded

    try:
        file_time = os.path.getmtime(SCAM_MODEL_PATH)

        if file_time > last_loaded:
            scam_model = joblib.load(SCAM_MODEL_PATH)
            scam_vectorizer = joblib.load(SCAM_VECTORIZER_PATH)
            last_loaded = file_time
            print("🔥 Classical model reloaded!")

    except Exception as e:
        print("Model reload error:", e)


def retrain_if_needed():
    try:
        if not FEEDBACK_PATH.exists():
            return

        data = pd.read_json(FEEDBACK_PATH, lines=True)

        if len(data) > 0 and len(data) % 10 == 0:
            print("⚡ Retraining model...")
            subprocess.Popen(["python", str(RETRAIN_SCRIPT_PATH)])

    except Exception as e:
        print("Retrain check error:", e)


def get_risk_level(probability: float) -> str:
    if probability >= 0.85:
        return "HIGH"
    elif probability >= 0.5:
        return "MEDIUM"
    return "LOW"


def explain_text(text: str, top_n: int = 5):
    """
    Simple Explainable AI:
    finds important words based on TF-IDF values in the input text.
    """
    try:
        vector = scam_vectorizer.transform([text])
        feature_names = scam_vectorizer.get_feature_names_out()

        row = vector.toarray()[0]
        top_indices = row.argsort()[-top_n:][::-1]

        keywords = [
            feature_names[i]
            for i in top_indices
            if row[i] > 0
        ]

        return keywords

    except Exception:
        return []


# ===== ROUTES =====
@app.get("/")
def root():
    return {
        "message": "AI Scam Detector API is running",
        "status": "ok"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "scam_model_loaded": scam_model is not None,
        "vectorizer_loaded": scam_vectorizer is not None,
        "transformer_loaded": transformer is not None,
        "ai_detector_loaded": ai_detector is not None
    }


@app.post("/analyze")
def analyze(msg: Message):
    reload_model_if_updated()

    text = msg.text.strip()

    if not text:
        return {
            "error": "Text is empty"
        }

    vec = scam_vectorizer.transform([text])
    scam_prob = float(scam_model.predict_proba(vec)[0][1])

    if scam_prob > 0.9:
        scam_label = "SCAM"
        confidence = scam_prob
        source = "classical_ml"

    elif scam_prob < 0.1:
        scam_label = "SAFE"
        confidence = 1 - scam_prob
        source = "classical_ml"

    else:
        result = transformer(text)[0]
        scam_label = "SCAM" if result["label"] == "LABEL_1" else "SAFE"
        confidence = float(result["score"])
        scam_prob = confidence if scam_label == "SCAM" else 1 - confidence
        source = "transformer"

    ai_result = ai_detector(text)[0]
    ai_label = "AI GENERATED" if ai_result["label"] != "Real" else "HUMAN"
    ai_prob = float(ai_result["score"])

    keywords = explain_text(text)

    return {
        "text": text,
        "scam_prediction": scam_label,
        "scam_probability": round(float(scam_prob), 3),
        "confidence": round(float(confidence), 3),
        "risk_level": get_risk_level(float(scam_prob)),
        "important_keywords": keywords,
        "ai_prediction": ai_label,
        "ai_probability": round(ai_prob, 3),
        "model_used": source
    }


@app.post("/feedback")
def save_feedback(fb: Feedback):
    label = fb.correct_label.upper().strip()

    if label not in ["SCAM", "SAFE"]:
        return {
            "error": "correct_label must be SCAM or SAFE"
        }

    data = {
        "text": fb.text,
        "label": label
    }

    FEEDBACK_PATH.parent.mkdir(parents=True, exist_ok=True)

    with open(FEEDBACK_PATH, "a", encoding="utf-8") as f:
        f.write(json.dumps(data, ensure_ascii=False) + "\n")

    retrain_if_needed()

    return {
        "status": "saved",
        "saved_feedback": data
    }