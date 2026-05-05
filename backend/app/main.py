from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
from transformers import pipeline
from fastapi.middleware.cors import CORSMiddleware
import json
import os
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


# ===== SCAM EXPLANATION CONFIG =====
SCAM_KEYWORD_CATEGORIES = {
    "phishing": [
        "password", "login", "verify", "account", "blocked", "security",
        "пароль", "аккаунт", "подтвердите", "заблокирован", "безопасность",
        "құпиясөз", "растаңыз", "бұғатталды", "қауіпсіздік"
    ],
    "financial_fraud": [
        "bank", "card", "payment", "money", "transfer", "wallet",
        "банк", "карта", "деньги", "оплата", "перевод", "кошелек", "счёт", "счет",
        "ақша", "төлем", "аударым", "әмиян", "шот"
    ],
    "lottery_scam": [
        "winner", "prize", "lottery", "won", "congratulations", "reward",
        "выиграли", "приз", "лотерея", "поздравляем", "награда",
        "ұтыс", "сыйлық", "жеңдіңіз"
    ],
    "social_engineering": [
        "urgent", "immediately", "now", "limited", "click", "confirm",
        "срочно", "немедленно", "быстро", "перейдите", "подтвердить",
        "шұғыл", "қазір", "сілтеме", "растаңыз"
    ],
    "fake_support": [
        "support", "security team", "helpdesk", "operator", "customer service",
        "поддержка", "служба безопасности", "оператор",
        "қолдау", "қауіпсіздік қызметі"
    ],
}

STOPWORDS = {
    # English
    "the", "and", "you", "your", "for", "now", "this", "that", "with",
    "can", "are", "is", "to", "of", "in", "on", "a", "an", "be", "will",
    "hi", "hello", "meet", "tomorrow", "please", "we", "i", "me", "my",

    # Russian
    "и", "в", "во", "на", "не", "что", "это", "как", "или", "для",
    "по", "из", "за", "от", "до", "же", "ли", "бы", "ты", "вы",
    "он", "она", "они", "мы", "я", "мне", "тебе", "вам", "нас",
    "можешь", "можно", "будет", "есть", "там", "тут", "уже",

    # Kazakh
    "мен", "және", "бұл", "сіз", "үшін", "ол", "біз", "бар", "жоқ",
    "қалай", "маған", "саған", "оның", "осы", "сол"
}


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
    scores = {}

    for category, keywords in SCAM_KEYWORD_CATEGORIES.items():
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


def get_transformer_scam_score(text: str) -> float:
    """
    Returns scam probability from transformer model.
    If transformer predicts SCAM, score is result score.
    If transformer predicts SAFE, scam score is 1 - score.
    """
    try:
        result = transformer(text[:512])[0]

        label = result["label"]
        score = float(result["score"])

        if label in ["LABEL_1", "SCAM", "scam"]:
            return score

        if label in ["LABEL_0", "SAFE", "safe"]:
            return 1 - score

        return score

    except Exception as e:
        print("Transformer scoring error:", e)
        return 0.5


def explain_text(text: str, top_n: int = 5):
    """
    Improved multilingual explainability:
    - detects suspicious scam-related keywords
    - adds TF-IDF model keywords
    - removes common stopwords
    """
    import re

    text_lower = text.lower()

    suspicious_keywords = []

    for keywords in SCAM_KEYWORD_CATEGORIES.values():
        for keyword in keywords:
            if keyword in text_lower and keyword not in suspicious_keywords:
                suspicious_keywords.append(keyword)

    model_keywords = []

    try:
        vector = scam_vectorizer.transform([text])
        feature_names = scam_vectorizer.get_feature_names_out()

        row = vector.toarray()[0]
        top_indices = row.argsort()[-top_n:][::-1]

        for i in top_indices:
            word = feature_names[i].lower()

            if row[i] <= 0:
                continue

            if word in STOPWORDS:
                continue

            if len(word) <= 2:
                continue

            if word not in model_keywords:
                model_keywords.append(word)

    except Exception:
        pass

    words = re.findall(
        r"[a-zA-Zа-яА-ЯёЁәғқңөұүһіӘҒҚҢӨҰҮҺІ0-9]+",
        text_lower
    )

    fallback_keywords = []

    for word in words:
        if len(word) <= 2:
            continue

        if word in STOPWORDS:
            continue

        if word.isdigit():
            continue

        if word not in fallback_keywords:
            fallback_keywords.append(word)

    final_keywords = []

    for word in suspicious_keywords + model_keywords + fallback_keywords:
        if word not in final_keywords:
            final_keywords.append(word)

    return final_keywords[:top_n], suspicious_keywords[:top_n]


def build_explanation_text(
    scam_label: str,
    scam_category: str,
    suspicious_keywords: list,
    hybrid_score: float
) -> str:
    if scam_label == "SAFE":
        if suspicious_keywords:
            return (
                "The message was classified as safe, but some potentially suspicious "
                "keywords were detected. The final hybrid score was not high enough "
                "to mark it as scam."
            )

        return (
            "The message was classified as safe because the hybrid model did not "
            "detect strong scam indicators."
        )

    if scam_category == "phishing":
        return (
            "This message was classified as phishing because it contains account, "
            "password, verification or blocking-related indicators."
        )

    if scam_category == "financial_fraud":
        return (
            "This message was classified as financial fraud because it contains "
            "banking, payment, card or money-related indicators."
        )

    if scam_category == "lottery_scam":
        return (
            "This message was classified as a lottery scam because it contains "
            "prize, winner or reward-related indicators."
        )

    if scam_category == "social_engineering":
        return (
            "This message was classified as social engineering because it uses "
            "urgency, pressure or action-demanding language."
        )

    if scam_category == "fake_support":
        return (
            "This message was classified as fake support because it imitates "
            "support, security team or operator communication."
        )

    return (
        "This message was classified as scam because the hybrid model detected "
        "suspicious language patterns."
    )


def analyze_generated_text(text: str):
    """
    AI-generated detector is used only as an auxiliary signal.
    It is skipped for short texts because short messages are unreliable for AI detection.
    """
    word_count = len(text.split())

    if word_count < 12:
        return "NOT ENOUGH TEXT", "SKIPPED_SHORT_TEXT", 0.0

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

    return ai_label, raw_ai_label, ai_prob


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
    try:
        reload_model_if_updated()

        text = msg.text.strip()

        if not text:
            raise HTTPException(
                status_code=400,
                detail="Text field cannot be empty"
            )

        # ===== HYBRID SCORING =====
        vec = scam_vectorizer.transform([text])
        classical_score = float(scam_model.predict_proba(vec)[0][1])

        transformer_score = get_transformer_scam_score(text)

        hybrid_score = (0.6 * classical_score) + (0.4 * transformer_score)

        scam_prob = hybrid_score
        scam_label = "SCAM" if hybrid_score >= 0.5 else "SAFE"
        confidence = hybrid_score if scam_label == "SCAM" else 1 - hybrid_score
        source = "hybrid_ml_transformer"

        # ===== CATEGORY + EXPLAINABILITY =====
        keywords, suspicious_keywords = explain_text(text)
        scam_category = detect_scam_category(text, scam_label)

        explanation_text = build_explanation_text(
            scam_label=scam_label,
            scam_category=scam_category,
            suspicious_keywords=suspicious_keywords,
            hybrid_score=hybrid_score
        )

        # ===== AI-GENERATED TEXT CHECK =====
        ai_label, raw_ai_label, ai_prob = analyze_generated_text(text)

        response = {
            "text": text,
            "scam_prediction": scam_label,
            "scam_probability": round(float(scam_prob), 3),
            "confidence": round(float(confidence), 3),
            "risk_level": get_risk_level(float(scam_prob)),
            "scam_category": scam_category,

            "classical_ml_score": round(float(classical_score), 3),
            "transformer_score": round(float(transformer_score), 3),
            "hybrid_score": round(float(hybrid_score), 3),

            "important_keywords": keywords,
            "suspicious_keywords": suspicious_keywords,
            "explanation_text": explanation_text,

            "ai_prediction": ai_label,
            "ai_raw_label": raw_ai_label,
            "ai_probability": round(ai_prob, 3),
            "model_used": source
        }

        save_history(response)

        return response

    except HTTPException:
        raise

    except Exception as e:
        print("Analyze error:", e)
        raise HTTPException(
            status_code=500,
            detail="Internal server error during message analysis"
        )


@app.post("/feedback")
def save_feedback(fb: Feedback):
    try:
        text = fb.text.strip()
        label = fb.correct_label.upper().strip()

        if not text:
            raise HTTPException(
                status_code=400,
                detail="Text field cannot be empty"
            )

        if label not in ["SCAM", "SAFE"]:
            raise HTTPException(
                status_code=400,
                detail="correct_label must be either SCAM or SAFE"
            )

        data = {
            "text": text,
            "label": label
        }

        FEEDBACK_PATH.parent.mkdir(parents=True, exist_ok=True)

        with open(FEEDBACK_PATH, "a", encoding="utf-8") as f:
            f.write(json.dumps(data, ensure_ascii=False) + "\n")

        retrain_if_needed()

        return {
            "status": "saved",
            "message": "Feedback saved successfully",
            "saved_feedback": data
        }

    except HTTPException:
        raise

    except Exception as e:
        print("Feedback save error:", e)
        raise HTTPException(
            status_code=500,
            detail="Internal server error while saving feedback"
        )


@app.get("/history")
def get_history():
    try:
        if not HISTORY_PATH.exists():
            return {
                "history": []
            }

        records = []

        with open(HISTORY_PATH, "r", encoding="utf-8") as f:
            for line in f:
                try:
                    records.append(json.loads(line))
                except json.JSONDecodeError:
                    continue

        return {
            "history": records[-20:][::-1]
        }

    except Exception as e:
        print("History read error:", e)
        raise HTTPException(
            status_code=500,
            detail="Internal server error while reading history"
        )


@app.get("/stats")
def get_stats():
    try:
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
                except json.JSONDecodeError:
                    continue

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

    except Exception as e:
        print("Stats error:", e)
        raise HTTPException(
            status_code=500,
            detail="Internal server error while calculating statistics"
        )