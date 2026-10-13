
from pathlib import Path

import pandas as pd
from pycaret.classification import load_model, predict_model
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)

# Project paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data" / "processed"
MODEL_DIR = PROJECT_ROOT / "models"

# Load the untouched test data
X_test = pd.read_csv(DATA_DIR / "X_test.csv")
y_test = pd.read_csv(DATA_DIR / "y_test.csv").squeeze()

# Load the saved PyCaret model
model = load_model(str(MODEL_DIR / "best_failure_model"))

# Predict equipment failures
predictions = predict_model(model, data=X_test)
y_pred = predictions["prediction_label"].astype(int)

# Evaluate the test predictions
print("\nFINAL TEST RESULTS")
print("-" * 45)
print(f"Accuracy:  {accuracy_score(y_test, y_pred):.4f}")
print(f"Precision: {precision_score(y_test, y_pred, zero_division=0):.4f}")
print(f"Recall:    {recall_score(y_test, y_pred, zero_division=0):.4f}")
print(f"F1-score:  {f1_score(y_test, y_pred, zero_division=0):.4f}")

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

print("\nClassification Report:")
print(classification_report(
    y_test,
    y_pred,
    labels=[0, 1],
    target_names=["No Failure", "Failure"],
    zero_division=0
))

# Save test predictions for later analysis
output_path = PROJECT_ROOT / "data" / "processed" / "test_predictions.csv"
predictions.to_csv(output_path, index=False)

print(f"\nTest predictions saved to: {output_path}")
