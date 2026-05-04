import pandas as pd
import matplotlib.pyplot as plt
import os

RESULTS_PATH = "research/multilingual_test_results.csv"
OUTPUT_PATH = "research/multilingual_accuracy_chart.png"

df = pd.read_csv(RESULTS_PATH)

summary = (
    df.groupby("language")["is_correct"]
    .mean()
    .mul(100)
    .reset_index()
    .rename(columns={"is_correct": "accuracy"})
)

plt.figure(figsize=(8, 5))
plt.bar(summary["language"], summary["accuracy"])

plt.title("Multilingual Scam Detection Accuracy")
plt.xlabel("Language")
plt.ylabel("Accuracy (%)")
plt.ylim(0, 100)

for index, row in summary.iterrows():
    plt.text(
        index,
        row["accuracy"] + 1,
        f"{row['accuracy']:.2f}%",
        ha="center"
    )

plt.tight_layout()

os.makedirs("research", exist_ok=True)
plt.savefig(OUTPUT_PATH, dpi=300)

print("Chart saved to:", OUTPUT_PATH)
print(summary)