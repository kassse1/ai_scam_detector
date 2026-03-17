import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import os

print("🚀 Starting retraining...")

# ===== ЗАГРУЗКА ОРИГИНАЛЬНЫХ ДАННЫХ =====
if os.path.exists("base_data.jsonl"):
    base_data = pd.read_json("base_data.jsonl", lines=True)
else:
    base_data = pd.DataFrame(columns=["text", "label"])

# ===== ЗАГРУЗКА FEEDBACK =====
if os.path.exists("feedback_data.jsonl"):
    feedback_data = pd.read_json("feedback_data.jsonl", lines=True)
else:
    print("❌ No feedback data")
    exit()

# ===== ОБЪЕДИНЕНИЕ =====
data = pd.concat([base_data, feedback_data], ignore_index=True)

if len(data) < 10:
    print("❌ Not enough data")
    exit()

X = data["text"]
y = data["label"]

# очистка
data = data.dropna()
data = data.drop_duplicates()

X = data["text"]
y = data["label"]

# нормальный vectorizer
vectorizer = TfidfVectorizer(
    ngram_range=(1,2),
    min_df=1
)

X_vec = vectorizer.fit_transform(X)

model = LogisticRegression(max_iter=1000)
model.fit(X_vec, y)

# ===== МОДЕЛЬ =====
model = LogisticRegression(max_iter=1000)
model.fit(X_vec, y)

# ===== СОХРАНЕНИЕ =====
joblib.dump(model, "scam_model.pkl")
joblib.dump(vectorizer, "vectorizer.pkl")

print(f"✅ Model retrained on {len(data)} samples")