import pandas as pd
import joblib
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.model_selection import train_test_split
from transformers import pipeline
import matplotlib.pyplot as plt
from pathlib import Path

# ===== PATHS =====
BASE_DIR = Path(__file__).resolve().parents[1]

DATA_PATH = BASE_DIR / "data" / "processed" / "final_dataset.csv"
MODEL_PATH = BASE_DIR / "ml" / "classical" / "scam_model.pkl"
VECTORIZER_PATH = BASE_DIR / "ml" / "classical" / "vectorizer.pkl"
TRANSFORMER_PATH = BASE_DIR / "ml" / "transformer" / "scam_transformer"

# ===== LOAD DATA =====
df = pd.read_csv(DATA_PATH)

df["label"] = df["label"].astype(int)

# уменьшим для скорости
df = df.sample(2000)

X_train, X_test, y_train, y_test = train_test_split(
    df["text"], df["label"], test_size=0.2
)

# ===== CLASSICAL MODEL =====
vectorizer = joblib.load(VECTORIZER_PATH)
model = joblib.load(MODEL_PATH)

X_test_vec = vectorizer.transform(X_test)
y_pred_ml = model.predict(X_test_vec)

# ===== TRANSFORMER =====
transformer = pipeline(
    "text-classification",
    model=str(TRANSFORMER_PATH),
    tokenizer=str(TRANSFORMER_PATH)
)

y_pred_tr = []

for text in X_test:
    res = transformer(text[:200])[0]
    label = 1 if res["label"] == "LABEL_1" else 0
    y_pred_tr.append(label)

# ===== METRICS =====
def get_metrics(y_true, y_pred):
    return {
        "accuracy": accuracy_score(y_true, y_pred),
        "precision": precision_score(y_true, y_pred),
        "recall": recall_score(y_true, y_pred),
        "f1": f1_score(y_true, y_pred),
    }

ml_metrics = get_metrics(y_test, y_pred_ml)
tr_metrics = get_metrics(y_test, y_pred_tr)

print("ML:", ml_metrics)
print("Transformer:", tr_metrics)

# ===== PLOT =====
labels = ["Accuracy", "Precision", "Recall", "F1"]

ml_values = list(ml_metrics.values())
tr_values = list(tr_metrics.values())

x = range(len(labels))
width = 0.35

plt.figure()

plt.bar([i - width/2 for i in x], ml_values, width, label="ML")
plt.bar([i + width/2 for i in x], tr_values, width, label="Transformer")

plt.xticks(x, labels)
plt.ylim(0, 1)
plt.legend()

plt.title("Model Comparison")
plt.xlabel("Metrics")
plt.ylabel("Score")

plt.savefig(BASE_DIR / "research" / "results" / "comparison.png")

plt.show()

print("📊 Saved graph to research/results/")