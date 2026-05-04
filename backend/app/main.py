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
HISTORY_PATH = BASE_DIR / "data" / "processed" / "history.jsonl"
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

def detect_scam_category(text: str, scam_label: str) -> str:
    if scam_label != "SCAM":
        return "safe"

    text_lower = text.lower()

    categories = {
        "phishing": [
            "password", "login", "verify", "account", "blocked",
            "пароль", "аккаунт", "подтвердите", "заблокирован",
            "құпиясөз", "растаңыз", "бұғатталды"
        ],
        "financial_fraud": [
            "bank", "card", "payment", "money", "transfer",
            "банк", "карта", "деньги", "оплата", "перевод",
            "ақша", "төлем", "аударым"
        ],
        "lottery_scam": [
            "winner", "prize", "lottery", "won", "congratulations",
            "выиграли", "приз", "лотерея", "поздравляем",
            "ұтыс", "сыйлық"
        ],
        "social_engineering": [
            "urgent", "immediately", "now", "limited", "click",
            "срочно", "немедленно", "быстро", "перейдите",
            "шұғыл", "қазір", "сілтеме"
        ],
        "fake_support": [
            "support", "security team", "helpdesk", "operator",
            "поддержка", "служба безопасности", "оператор",
            "қолдау", "қауіпсіздік қызметі"
        ],
    }

    scores = {}

    for category, keywords in categories.items():
        scores[category] = sum(1 for word in keywords if word in text_lower)

    best_category = max(scores, key=scores.get)

    if scores[best_category] == 0:
        return "general_scam"

    return best_category


def save_history(record: dict):
    try:
        HISTORY_PATH.parent.mkdir(parents=True, exist_ok=True)

        with open(HISTORY_PATH, "a", encoding="utf-8") as f:
            f.write(json.dumps(record, ensure_ascii=False) + "\n")

    except Exception as e:
        print("History save error:", e)


def explain_text(text: str, top_n: int = 5):
    """
    Multilingual Explainable AI:
    1. Uses TF-IDF feature importance if available.
    2. Adds fallback keywords directly from input text.
    3. Works better for English, Russian, Kazakh and other space-separated languages.
    """
    import re

    stopwords = {
        # English
        "the", "and", "you", "your", "for", "now", "this", "that", "with",
        "can", "are", "is", "to", "of", "in", "on", "a", "an", "hi", "hello", "meet", "tomorrow", "can", "we", "will", "please", "be", "will",

        # Russian
        "и", "в", "во", "на", "не", "что", "это", "как", "или", "для",
        "по", "из", "за", "от", "до", "же", "ли", "бы", "ты", "вы",
        "он", "она", "они", "мы", "я", "мне", "тебе", "вам", "нас",
        "можешь", "можно", "будет", "есть", "там", "тут", "уже",

        # Kazakh
        "мен", "және", "бұл", "сіз", "үшін", "ол", "біз", "бар", "жоқ",
        "қалай", "маған", "саған", "оның", "осы", "сол"
    }

    keywords = []

    # ===== 1. TF-IDF keywords =====
    try:
        vector = scam_vectorizer.transform([text])
        feature_names = scam_vectorizer.get_feature_names_out()

        row = vector.toarray()[0]
        top_indices = row.argsort()[-top_n:][::-1]

        for i in top_indices:
            word = feature_names[i]
            if row[i] > 0 and word not in keywords:
                keywords.append(word)

    except Exception:
        pass

    # ===== 2. Multilingual fallback tokens =====
    text_lower = text.lower()

    # Works for English, Russian, Kazakh letters and numbers
    words = re.findall(
        r"[a-zA-Zа-яА-ЯёЁәғқңөұүһіӘҒҚҢӨҰҮҺІ0-9]+",
        text_lower
    )

    for word in words:
        if len(word) <= 2:
            continue

        if word in stopwords:
            continue

        if word.isdigit():
            continue

        if word not in keywords:
            keywords.append(word)

    return keywords[:top_n]

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

    word_count = len(text.split())

    if word_count < 12:
        raw_ai_label = "SKIPPED_SHORT_TEXT"
        ai_label = "NOT ENOUGH TEXT"
        ai_prob = 0.0
    else:
        ai_result = ai_detector(text)[0]

        raw_ai_label = ai_result["label"]
        ai_prob = float(ai_result["score"])

        print("AI RESULT:", ai_result)

        if raw_ai_label in ["Real", "real", "HUMAN", "LABEL_0"]:
            ai_label = "HUMAN"
        elif raw_ai_label in ["Fake", "fake", "AI", "AI GENERATED", "LABEL_1"]:
            ai_label = "AI GENERATED"
        else:
            ai_label = raw_ai_label

    keywords = explain_text(text)

    scam_category = detect_scam_category(text, scam_label)

    response = {
        "text": text,
        "scam_prediction": scam_label,
        "scam_probability": round(float(scam_prob), 3),
        "confidence": round(float(confidence), 3),
        "risk_level": get_risk_level(float(scam_prob)),
        "scam_category": scam_category,
        "important_keywords": keywords,
        "ai_prediction": ai_label,
        "ai_raw_label": raw_ai_label,
        "ai_probability": round(ai_prob, 3),
        "model_used": source
    }

    save_history(response)

    return response


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

@app.get("/history")
def get_history():
    if not HISTORY_PATH.exists():
        return {
            "history": []
        }

    records = []

    with open(HISTORY_PATH, "r", encoding="utf-8") as f:
        for line in f:
            try:
                records.append(json.loads(line))
            except Exception:
                pass

    return {
        "history": records[-20:][::-1]
    }


@app.get("/stats")
def get_stats():
    if not HISTORY_PATH.exists():
        return {
            "total_checks": 0,
            "scam_count": 0,
            "safe_count": 0,
            "high_risk_count": 0,
            "categories": {},
            "top_keywords": []
        }

    records = []

    with open(HISTORY_PATH, "r", encoding="utf-8") as f:
        for line in f:
            try:
                records.append(json.loads(line))
            except Exception:
                pass

    total = len(records)
    scam_count = sum(1 for r in records if r.get("scam_prediction") == "SCAM")
    safe_count = sum(1 for r in records if r.get("scam_prediction") == "SAFE")
    high_risk_count = sum(1 for r in records if r.get("risk_level") == "HIGH")

    categories = {}
    keywords = {}

    for r in records:
        category = r.get("scam_category", "unknown")
        categories[category] = categories.get(category, 0) + 1

        for word in r.get("important_keywords", []):
            keywords[word] = keywords.get(word, 0) + 1

    top_keywords = sorted(
        keywords.items(),
        key=lambda x: x[1],
        reverse=True
    )[:10]

    return {
        "total_checks": total,
        "scam_count": scam_count,
        "safe_count": safe_count,
        "high_risk_count": high_risk_count,
        "categories": categories,
        "top_keywords": top_keywords
    }