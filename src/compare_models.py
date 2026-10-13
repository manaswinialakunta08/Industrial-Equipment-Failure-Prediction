
from pathlib import Path

import pandas as pd
from pycaret.classification import (
    setup,
    compare_models,
    pull,
    save_model
)

# Define project paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data" / "processed"
MODEL_DIR = PROJECT_ROOT / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

# Load existing training data
X_train = pd.read_csv(DATA_DIR / "X_train.csv")
y_train = pd.read_csv(DATA_DIR / "y_train.csv").squeeze()

# Combine features and target
train_data = X_train.copy()
train_data["Machine failure"] = y_train.to_numpy()

print("Training data loaded:", train_data.shape)
print("Failure distribution:")
print(train_data["Machine failure"].value_counts())

# Configure PyCaret
setup(
    data=train_data,
    target="Machine failure",
    session_id=42,
    fold=5,
    fix_imbalance=True,
    normalize=True,
    verbose=True
)

# Compare selected algorithms
best_model = compare_models(
    sort="F1",
    include=["lr", "dt", "rf", "et", "lightgbm"]
)

# Display comparison table
results = pull()
print("\nMODEL COMPARISON RESULTS")
print(results)

# Save the selected model
save_model(best_model, str(MODEL_DIR / "best_failure_model"))

print("\nBest model saved successfully.")
