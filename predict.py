import joblib

model = joblib.load("scam_model.pkl")
vectorizer = joblib.load("vectorizer.pkl")


def predict_message(text):

    vec = vectorizer.transform([text])

    prob = model.predict_proba(vec)[0][1]

    if prob > 0.5:
        label = "SCAM"
    else:
        label = "SAFE"

    return label, prob