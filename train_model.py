import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# загрузка данных
df = pd.read_csv("final_dataset.csv")

X = df["text"]
y = df["label"]

# train test split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# TF-IDF
vectorizer = TfidfVectorizer(max_features=5000)

X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# модель
model = LogisticRegression(max_iter=1000)

model.fit(X_train_vec, y_train)

pred = model.predict(X_test_vec)

print("Accuracy:", accuracy_score(y_test, pred))

# сохранение
joblib.dump(model, "scam_model.pkl")
joblib.dump(vectorizer, "vectorizer.pkl")

print("Model saved!")