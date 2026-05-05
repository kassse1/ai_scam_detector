import requests
import pandas as pd
from datetime import datetime

API_URL = "http://127.0.0.1:8000/analyze"

TEST_CASES = [
    # =========================
    # ENGLISH - SCAM
    # =========================
    {
        "language": "EN",
        "text": "Your bank account has been blocked. Click this link immediately to verify your identity.",
        "expected": "Scam",
    },
    {
        "language": "EN",
        "text": "Congratulations! You won $5000. Send your card details to claim the prize.",
        "expected": "Scam",
    },
    {
        "language": "EN",
        "text": "Urgent security alert: confirm your password now or your account will be deleted.",
        "expected": "Scam",
    },

    # =========================
    # ENGLISH - SAFE
    # =========================
    {
        "language": "EN",
        "text": "Hi, are we still meeting tomorrow at 3 PM?",
        "expected": "Safe",
    },
    {
        "language": "EN",
        "text": "Your package has been delivered to the reception desk.",
        "expected": "Safe",
    },
    {
        "language": "EN",
        "text": "Please review the attached project report before Friday.",
        "expected": "Safe",
    },

    # =========================
    # RUSSIAN - SCAM
    # =========================
    {
        "language": "RU",
        "text": "Ваш банковский счет заблокирован. Срочно перейдите по ссылке и подтвердите данные карты.",
        "expected": "Scam",
    },
    {
        "language": "RU",
        "text": "Вы выиграли 1 000 000 тенге. Отправьте номер карты и CVV для получения приза.",
        "expected": "Scam",
    },
    {
        "language": "RU",
        "text": "Подозрительная активность в аккаунте. Введите пароль по ссылке, иначе доступ будет закрыт.",
        "expected": "Scam",
    },

    # =========================
    # RUSSIAN - SAFE
    # =========================
    {
        "language": "RU",
        "text": "Привет, можешь скинуть файл с отчетом сегодня вечером?",
        "expected": "Safe",
    },
    {
        "language": "RU",
        "text": "Завтра пара начинается в 10 утра, не забудь ноутбук.",
        "expected": "Safe",
    },
    {
        "language": "RU",
        "text": "Ваш заказ доставлен. Спасибо за покупку.",
        "expected": "Safe",
    },

    # =========================
    # KAZAKH - SCAM
    # =========================
    {
        "language": "KZ",
        "text": "Сіздің банк шотыңыз бұғатталды. Дереу сілтеме арқылы карта деректерін растаңыз.",
        "expected": "Scam",
    },
    {
        "language": "KZ",
        "text": "Сіз 500 000 теңге ұтып алдыңыз. Жүлдені алу үшін карта нөмірі мен CVV кодын жіберіңіз.",
        "expected": "Scam",
    },
    {
        "language": "KZ",
        "text": "Аккаунтыңызда күмәнді әрекет анықталды. Құпиясөзіңізді осы сілтеме арқылы енгізіңіз.",
        "expected": "Scam",
    },

    # =========================
    # KAZAKH - SAFE
    # =========================
    {
        "language": "KZ",
        "text": "Сәлем, ертең сабақ нешеде басталады?",
        "expected": "Safe",
    },
    {
        "language": "KZ",
        "text": "Жобаның есебін бүгін кешке жіберіп жіберші.",
        "expected": "Safe",
    },
    {
        "language": "KZ",
        "text": "Тапсырысыңыз жеткізілді. Сатып алғаныңыз үшін рақмет.",
        "expected": "Safe",
    },
]


def normalize_prediction(result: dict) -> str:
    """
    Normalize backend output into 'Scam' or 'Safe'.
    Supports different API response formats.
    """

    # Case 1: boolean field
    if "is_scam" in result:
        return "Scam" if result["is_scam"] else "Safe"

    # Case 2: numeric label
    if "label" in result:
        label = result["label"]

        if label == 1 or str(label).lower() in ["1", "scam", "spam", "fraud", "phishing"]:
            return "Scam"

        if label == 0 or str(label).lower() in ["0", "safe", "ham", "normal"]:
            return "Safe"

    # Case 3: prediction fields
    possible_fields = [
        "risk_level",
        "prediction",
        "result",
        "class",
        "status",
        "final_prediction",
        "final_result",
    ]

    for field in possible_fields:
        if field in result:
            value = str(result[field]).lower()

            if value in ["scam", "spam", "fraud", "phishing", "high", "dangerous"]:
                return "Scam"

            if value in ["safe", "ham", "normal", "low", "legitimate"]:
                return "Safe"

            if "scam" in value or "fraud" in value or "phishing" in value:
                return "Scam"

            if "safe" in value or "normal" in value or "legitimate" in value:
                return "Safe"

    # Case 4: probability fields
    probability_fields = [
        "scam_probability",
        "probability",
        "confidence",
        "score",
    ]

    for field in probability_fields:
        if field in result:
            try:
                value = float(result[field])

                # If backend returns 0-100
                if value > 1:
                    value = value / 100

                return "Scam" if value >= 0.5 else "Safe"

            except Exception:
                pass

    return "Unknown"


def run_tests():
    rows = []

    for i, case in enumerate(TEST_CASES, start=1):
        text = case["text"]

        try:
            response = requests.post(
                API_URL,
                json={"text": text},
                timeout=15,
            )

            if response.status_code != 200:
                prediction = "Error"
                confidence = None
                important_keywords = []
                raw_response = response.text
            else:
                data = response.json()

                prediction = normalize_prediction(data)
                confidence = data.get("confidence")
                important_keywords = data.get("important_keywords", [])
                raw_response = data

        except Exception as e:
            prediction = "Error"
            confidence = None
            important_keywords = []
            raw_response = str(e)

        expected = case["expected"]
        is_correct = prediction == expected

        rows.append(
            {
                "id": i,
                "language": case["language"],
                "text": text,
                "expected": expected,
                "predicted": prediction,
                "confidence": confidence,
                "important_keywords": ", ".join(important_keywords)
                if isinstance(important_keywords, list)
                else important_keywords,
                "is_correct": is_correct,
                "raw_response": raw_response,
            }
        )

        print(
            f"[{i}] {case['language']} | expected={expected} | "
            f"predicted={prediction} | correct={is_correct}"
        )

    df = pd.DataFrame(rows)

    accuracy = df["is_correct"].mean() * 100

    print("\n==============================")
    print("MULTILINGUAL TEST RESULTS")
    print("==============================")
    print(f"Total samples: {len(df)}")
    print(f"Accuracy: {accuracy:.2f}%")

    print("\nAccuracy by language:")
    print(df.groupby("language")["is_correct"].mean() * 100)

    output_path = "research/multilingual_test_results.csv"
    df.to_csv(output_path, index=False, encoding="utf-8-sig")

    print(f"\nResults saved to: {output_path}")


if __name__ == "__main__":
    run_tests()