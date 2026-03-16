import pandas as pd
from datasets import Dataset
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from transformers import TrainingArguments, Trainer

# =========================
# загрузка датасета
# =========================

df = pd.read_csv("final_dataset.csv")

df["label"] = df["label"].astype(int)

# уменьшаем датасет для быстрого обучения
df = df.sample(20000)

# =========================
# создаем HuggingFace dataset
# =========================

dataset = Dataset.from_pandas(df)

# VERY IMPORTANT
dataset = dataset.rename_column("label", "labels")

dataset = dataset.train_test_split(test_size=0.2)

# =========================
# модель
# =========================

model_name = "xlm-roberta-base"

tokenizer = AutoTokenizer.from_pretrained(model_name)

# =========================
# токенизация
# =========================

def tokenize(example):
    return tokenizer(
        example["text"],
        truncation=True,
        padding="max_length",
        max_length=128
    )

dataset = dataset.map(tokenize)

# =========================
# загрузка модели
# =========================

model = AutoModelForSequenceClassification.from_pretrained(
    model_name,
    num_labels=2
)

# =========================
# параметры обучения
# =========================

training_args = TrainingArguments(
    output_dir="./results",
    learning_rate=2e-5,
    per_device_train_batch_size=16,
    num_train_epochs=2,
    logging_steps=100,
    save_steps=500,
)

# =========================
# trainer
# =========================

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset["train"],
    eval_dataset=dataset["test"],
)

# =========================
# обучение
# =========================

trainer.train()

# =========================
# сохранение модели
# =========================

trainer.save_model("scam_transformer")
tokenizer.save_pretrained("scam_transformer")