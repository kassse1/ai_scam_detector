from fastapi import FastAPI
from pydantic import BaseModel
import joblib
from transformers import pipeline

app = FastAPI()

ai_detector = pipeline(
    "text-classification",
    model="roberta-base-openai-detector"
)

# ===== FAST MODEL =====
scam_model = joblib.load("scam_model.pkl")
scam_vectorizer = joblib.load("vectorizer.pkl")

# ===== AI MODEL =====
ai_model = joblib.load("ai_model.pkl")
ai_vectorizer = joblib.load("ai_vectorizer.pkl")

# ===== TRANSFORMER MODEL =====
transformer = pipeline(
    "text-classification",
    model="scam_transformer",
    tokenizer="scam_transformer"
)

class Message(BaseModel):
    text: str


@app.post("/analyze")
def analyze(msg: Message):

    text = msg.text

    # ---------- FAST SCAM MODEL ----------
    vec = scam_vectorizer.transform([text])
    scam_prob = scam_model.predict_proba(vec)[0][1]

    # если уверенность высокая — не используем transformer
    if scam_prob > 0.9:
        scam_label = "SCAM"
        source = "fast_model"

    elif scam_prob < 0.1:
        scam_label = "SAFE"
        source = "fast_model"

    else:
        # ---------- TRANSFORMER CHECK ----------
        result = transformer(text)[0]

        scam_label = "SCAM" if result["label"] == "LABEL_1" else "SAFE"
        scam_prob = result["score"]
        source = "transformer"


    # ---------- AI DETECTION ----------
    ai_result = ai_detector(text)[0]

    ai_label = "AI GENERATED" if ai_result["label"] != "Real" else "HUMAN"
    ai_prob = ai_result["score"]


    return {
        "text": text,
        "scam_prediction": scam_label,
        "scam_probability": round(float(scam_prob),3),
        "ai_prediction": ai_label,
        "ai_probability": round(float(ai_prob),3),
        "model_used": source
    }