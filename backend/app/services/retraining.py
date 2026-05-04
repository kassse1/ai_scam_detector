import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from pathlib import Path


print("🚀 Starting retraining...")


# ===== PATHS =====
BASE_DIR = Path(__file__).resolve().parents[3]

BASE_DATA_PATH = BASE_DIR / "data" / "processed" / "base_data.jsonl"
FEEDBACK_PATH = BASE_DIR / "data" / "processed" / "feedback_data.jsonl"

MODEL_PATH = BASE_DIR / "ml" / "classical" / "scam_model.pkl"
VECTORIZER_PATH = BASE_DIR / "ml" / "classical" / "vectorizer.pkl"


# ===== LOAD BASE DATA =====
if BASE_DATA_PATH.exists():
    base_data = pd.read_json(BASE_DATA_PATH, lines=True)
else:
    print("⚠️ base_data.jsonl not found, using only feedback data")
    base_data = pd.DataFrame(columns=["text", "label"])


# ===== LOAD FEEDBACK =====
if FEEDBACK_PATH.exists():
    feedback_data = pd.read_json(FEEDBACK_PATH, lines=True)
else:
    print("❌ No feedback data found")
    exit()


# ===== MERGE DATA =====
data = pd.concat([base_data, feedback_data], ignore_index=True)

data = data.dropna()
data = data.drop_duplicates()

if len(data) < 10:
    print(f"❌ Not enough data: {len(data)} samples")
    exit()


# ===== NORMALIZE LABELS =====
data["label"] = data["label"].astype(str).str.upper().str.strip()

data["label"] = data["label"].replace({
    "SCAM": 1,
    "SAFE": 0,
    "SPAM": 1,
    "HAM": 0
})

data = data[data["label"].isin([0, 1])]

if len(data["label"].unique()) < 2:
    print("❌ Need both classes: SCAM and SAFE")
    exit()


X = data["text"].astype(str)
y = data["label"].astype(int)


# ===== TRAIN MODEL =====
vectorizer = TfidfVectorizer(
    ngram_range=(1, 2),
    min_df=1,
    max_features=50000
)

X_vec = vectorizer.fit_transform(X)

model = LogisticRegression(max_iter=1000)
model.fit(X_vec, y)


# ===== SAVE MODEL =====
joblib.dump(model, MODEL_PATH)
joblib.dump(vectorizer, VECTORIZER_PATH)

print(f"✅ Model retrained on {len(data)} samples")
print(f"✅ Saved model to: {MODEL_PATH}")
print(f"✅ Saved vectorizer to: {VECTORIZER_PATH}")