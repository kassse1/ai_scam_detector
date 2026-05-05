import pandas as pd

# =========================
# 1 SMS SPAM DATASET
# =========================

sms = pd.read_csv(
    "SMSSpamCollection",
    sep="\t",
    names=["label", "text"]
)

sms["label"] = sms["label"].map({
    "ham": 0,
    "spam": 1
})

# =========================
# 2 PHISHING EMAIL DATASET
# =========================

phishing = pd.read_csv("phishing_email.csv")

phishing = phishing.rename(columns={
    "text_combined": "text"
})

phishing = phishing[["text", "label"]]

# =========================
# 3 AI VS HUMAN DATASET
# =========================

ai = pd.read_csv("AI_Human.csv")

ai = ai.rename(columns={
    "text": "text",
    "generated": "label"
})

ai = ai[["text", "label"]]

# =========================
# ОБЪЕДИНЕНИЕ
# =========================

df = pd.concat([sms, phishing, ai])

df = df.dropna()

print("Total messages:", len(df))

df.to_csv("final_dataset.csv", index=False)

print("Dataset saved!")