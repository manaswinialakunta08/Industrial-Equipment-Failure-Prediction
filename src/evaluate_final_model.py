
from pathlib import Path
import pandas as pd

from pycaret.classification import load_model, predict_model
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report,
)

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data" / "processed"
MODEL_DIR = PROJECT_ROOT / "models"

THRESHOLD = 0.45

# Load the untouched test dataset
X_test = pd.read_csv(DATA_DIR / "X_test.csv")
y_test = pd.read_csv(DATA_DIR / "y_test.csv").squeeze()

# Load the final trained model
model = load_model(
    str(MODEL_DIR / "final_extra_trees_threshold_045")
)

print("Predicting failure probabilities...")
predictions = predict_model(model, data=X_test, raw_score=True)

failure_probabilities = predictions["prediction_score_1"]
y_pred = (failure_probabilities >= THRESHOLD).astype(int)

print(f"\nFINAL TEST RESULTS — THRESHOLD {THRESHOLD}")
print("=" * 48)

print(f"Accuracy:  {accuracy_score(y_test, y_pred):.4f}")
print(f"Precision: {precision_score(y_test, y_pred, zero_division=0):.4f}")
print(f"Recall:    {recall_score(y_test, y_pred, zero_division=0):.4f}")
print(f"F1-score:  {f1_score(y_test, y_pred, zero_division=0):.4f}")

cm = confusion_matrix(y_test, y_pred, labels=[0, 1])

print("\nConfusion Matrix:")
print(cm)

tn, fp, fn, tp = cm.ravel()

print(f"\nFailures detected: {tp}")
print(f"Failures missed:   {fn}")
print(f"False alarms:      {fp}")
print(f"Correct rejections: {tn}")

print("\nClassification Report:")
print(
    classification_report(
        y_test,
        y_pred,
        labels=[0, 1],
        target_names=["No Failure", "Failure"],
        zero_division=0,
    )
)

print("\nFinal evaluation completed.")
