
from pathlib import Path

import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix
)

from pycaret.classification import setup, create_model, predict_model


# Project paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data" / "processed"

# Load the existing training data
X = pd.read_csv(DATA_DIR / "X_train.csv")
y = pd.read_csv(DATA_DIR / "y_train.csv").squeeze()

# Reserve part of training data for validation
X_fit, X_val, y_fit, y_val = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("Model-fitting rows:", len(X_fit))
print("Validation rows:", len(X_val))

# Prepare data for PyCaret
fit_data = X_fit.copy()
fit_data["Machine failure"] = y_fit.to_numpy()

setup(
    data=fit_data,
    target="Machine failure",
    session_id=42,
    fold=5,
    fix_imbalance=True,
    normalize=True,
    verbose=False
)

# Train Extra Trees on the fitting data
print("\nTraining Extra Trees...")
model = create_model("et")

# Obtain predicted failure probabilities for validation rows
predictions = predict_model(
    model,
    data=X_val,
    raw_score=True
)

print("\nPrediction columns:", predictions.columns.tolist())

# Find the probability column for class 1 (failure)
probability_column = "prediction_score_1"

if probability_column not in predictions.columns:
    raise ValueError(
        f"Expected {probability_column}, but it was not found. "
        "Check the prediction columns printed above."
    )

failure_probabilities = predictions[probability_column].to_numpy()

# Evaluate several possible thresholds
results = []

for threshold in np.arange(0.10, 0.61, 0.05):
    y_pred = (
        failure_probabilities >= threshold
    ).astype(int)

    tn, fp, fn, tp = confusion_matrix(
        y_val, y_pred, labels=[0, 1]
    ).ravel()

    results.append({
        "Threshold": round(threshold, 2),
        "Accuracy": accuracy_score(y_val, y_pred),
        "Precision": precision_score(
            y_val, y_pred, zero_division=0
        ),
        "Recall": recall_score(
            y_val, y_pred, zero_division=0
        ),
        "F1-score": f1_score(
            y_val, y_pred, zero_division=0
        ),
        "False Alarms": fp,
        "Missed Failures": fn
    })

results_df = pd.DataFrame(results)

print("\nTHRESHOLD COMPARISON - VALIDATION DATA")
print(results_df.round(4).to_string(index=False))

print("\nThreshold tuning completed.")
print("The test set was not used.")
