import joblib
from langdetect import detect
from deep_translator import GoogleTranslator

model = joblib.load("scam_model.pkl")
vectorizer = joblib.load("vectorizer.pkl")


def predict_message(text):

    try:
        lang = detect(text)
    except:
        lang = "en"

    # перевод если не английский
    if lang != "en":
        text = GoogleTranslator(source='auto', target='en').translate(text)

    vec = vectorizer.transform([text])

    prob = model.predict_proba(vec)[0][1]

    label = "SCAM" if prob > 0.5 else "SAFE"

    return label, prob, lang