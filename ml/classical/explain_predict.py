import joblib
import numpy as np

model = joblib.load("scam_model.pkl")
vectorizer = joblib.load("vectorizer.pkl")


def predict_with_explanation(text):

    vec = vectorizer.transform([text])

    prob = model.predict_proba(vec)[0][1]

    label = "SCAM" if prob > 0.5 else "SAFE"

    feature_names = vectorizer.get_feature_names_out()

    scores = vec.toarray()[0]

    top_indices = np.argsort(scores)[-5:]

    keywords = [feature_names[i] for i in top_indices if scores[i] > 0]

    return label, prob, keywords