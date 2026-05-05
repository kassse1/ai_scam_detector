import pandas as pd
import matplotlib.pyplot as plt
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay

RESULTS_PATH = "research/multilingual_test_results.csv"
OUTPUT_PATH = "research/multilingual_confusion_matrix.png"

df = pd.read_csv(RESULTS_PATH)

labels = ["Safe", "Scam"]

cm = confusion_matrix(
    df["expected"],
    df["predicted"],
    labels=labels
)

disp = ConfusionMatrixDisplay(
    confusion_matrix=cm,
    display_labels=labels
)

disp.plot(values_format="d")

plt.title("Multilingual Scam Detection Confusion Matrix")
plt.tight_layout()
plt.savefig(OUTPUT_PATH, dpi=300)

print("Confusion matrix saved to:", OUTPUT_PATH)
print(cm)