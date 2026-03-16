from transformers import pipeline

classifier = pipeline(
    "text-classification",
    model="scam_transformer",
    tokenizer="scam_transformer"
)

texts = [

# ===== SCAM =====

"Verify your bank account immediately",
"URGENT! Your account has been suspended click here",
"Win a FREE iPhone now click here",
"You have been selected to receive a $1000 reward",
"Your PayPal account has been limited. Login now",
"Claim your prize by clicking this link",
"Your package is waiting confirm your address",
"Final notice about your account verification",

# ===== NORMAL =====

"Hey bro are we meeting tomorrow?",
"Can you send me the homework file?",
"I will call you later tonight",
"Let's go to the gym tomorrow",
"Did you finish the project?",
"Happy birthday bro!",
"What time is the meeting tomorrow?",

# ===== RUSSIAN =====

"Привет как дела",
"Давай встретимся завтра",
"Отправь пожалуйста файл",
"Срочно подтвердите ваш банковский аккаунт",
"Ваш аккаунт был заблокирован перейдите по ссылке",

# ===== KAZAKH =====

"Сәлем қалайсың",
"Бүгін кездесеміз бе",
"Сіздің банктік шотыңыз бұғатталды",
"Сілтемеге өтіп аккаунтыңызды растаңыз",

# ===== PHISHING =====

"Your bank account has been locked please login here",
"Security alert unusual login attempt detected",
"Confirm your identity to avoid account suspension",

# ===== CRYPTO SCAM =====

"Send 1 BTC and receive 2 BTC instantly",
"Elon Musk crypto giveaway double your crypto",
"Limited time crypto investment opportunity",

# ===== OBFUSCATED SCAM =====

"v3r1fy y0ur acc0unt n0w",
"cl1ck h3r3 t0 w1n fr33 pr1ze",
"y0u w0n 1000$ cl1ck n0w",

# ===== AI GENERATED STYLE =====

"Dear user we noticed unusual activity in your account please verify your identity immediately",
"Congratulations you have been selected as a lucky winner in our promotional campaign",
"To ensure uninterrupted service please confirm your account details",


# Spanish
"Verifique su cuenta bancaria inmediatamente",

# French
"Votre compte bancaire a été suspendu cliquez ici",

# German
"Ihr Konto wurde gesperrt bitte bestätigen Sie jetzt",

# Turkish
"Hesabınızı doğrulamak için buraya tıklayın",

# Arabic
"تم تعليق حسابك المصرفي يرجى التحقق الآن",

# Chinese
"您的银行账户已被暂停 请立即验证",

]

for t in texts:

    result = classifier(t)[0]

    label = "SCAM" if result["label"] == "LABEL_1" else "SAFE"

    print("Message:", t)
    print("Prediction:", label)
    print("Confidence:", round(result["score"], 3))
    print("------------------------------------------------")