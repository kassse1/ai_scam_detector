import pandas as pd
from sklearn.metrics import classification_report

RESULTS_PATH = "research/multilingual_test_results.csv"
OUTPUT_PATH = "research/multilingual_classification_report.txt"

df = pd.read_csv(RESULTS_PATH)

report = classification_report(
    df["expected"],
    df["predicted"],
    labels=["Safe", "Scam"],
    target_names=["Safe", "Scam"],
)

print(report)

with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    f.write(report)

print("Classification report saved to:", OUTPUT_PATH)