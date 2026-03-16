from transformers import GPT2LMHeadModel, GPT2Tokenizer
import torch
import math

tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
model = GPT2LMHeadModel.from_pretrained("gpt2")

def detect_ai(text):

    inputs = tokenizer(text, return_tensors="pt")

    with torch.no_grad():
        outputs = model(**inputs, labels=inputs["input_ids"])

    loss = outputs.loss
    perplexity = math.exp(loss)

    if perplexity < 30:
        label = "AI GENERATED"
    else:
        label = "HUMAN"

    return {
        "text": text,
        "perplexity": float(perplexity),
        "prediction": label
    }