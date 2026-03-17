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

app = FastAPI()

# ===== CORS =====
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== LOAD MODELS =====
scam_model = joblib.load("scam_model.pkl")
scam_vectorizer = joblib.load("vectorizer.pkl")

ai_detector = pipeline(
    "text-classification",
    model="roberta-base-openai-detector"
)

transformer = pipeline(
    "text-classification",
    model="scam_transformer",
    tokenizer="scam_transformer"
)

last_loaded = time.time()

# ===== SCHEMAS =====
class Message(BaseModel):
    text: str

class Feedback(BaseModel):
    text: str
    correct_label: str  # SCAM / SAFE


# ===== MODEL RELOAD =====
def reload_model_if_updated():
    global scam_model, scam_vectorizer, last_loaded

    try:
        file_time = os.path.getmtime("scam_model.pkl")

        if file_time > last_loaded:
            scam_model = joblib.load("scam_model.pkl")
            scam_vectorizer = joblib.load("vectorizer.pkl")
            last_loaded = time.time()
            print("🔥 Model reloaded!")
    except:
        pass


# ===== AUTO RETRAIN =====
def retrain_if_needed():
    try:
        if not os.path.exists("feedback_data.jsonl"):
            return

        data = pd.read_json("feedback_data.jsonl", lines=True)

        if len(data) % 10 == 0:  # каждые 10 примеров
            print("⚡ Retraining model...")
            subprocess.Popen(["python", "retrain.py"])
    except:
        pass


# ===== ANALYZE =====
@app.post("/analyze")
def analyze(msg: Message):

    reload_model_if_updated()

    text = msg.text

    vec = scam_vectorizer.transform([text])
    scam_prob = scam_model.predict_proba(vec)[0][1]

    if scam_prob > 0.9:
        scam_label = "SCAM"
        source = "fast_model"

    elif scam_prob < 0.1:
        scam_label = "SAFE"
        source = "fast_model"

    else:
        result = transformer(text)[0]
        scam_label = "SCAM" if result["label"] == "LABEL_1" else "SAFE"
        scam_prob = result["score"]
        source = "transformer"

    ai_result = ai_detector(text)[0]
    ai_label = "AI GENERATED" if ai_result["label"] != "Real" else "HUMAN"
    ai_prob = ai_result["score"]

    return {
        "text": text,
        "scam_prediction": scam_label,
        "ai_prediction": ai_label,
        "ai_probability": round(float(ai_prob), 3),
        "model_used": source
    }


# ===== FEEDBACK =====
@app.post("/feedback")
def save_feedback(fb: Feedback):

    data = {
        "text": fb.text,
        "label": fb.correct_label
    }

    with open("feedback_data.jsonl", "a", encoding="utf-8") as f:
        f.write(json.dumps(data) + "\n")

    retrain_if_needed()

    return {"status": "saved"}