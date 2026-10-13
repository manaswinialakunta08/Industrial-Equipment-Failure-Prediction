
from pathlib import Path

import pandas as pd
from pycaret.classification import setup, create_model, save_model

# Project paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data" / "processed"
MODEL_DIR = PROJECT_ROOT / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

# Load training data only
X_train = pd.read_csv(DATA_DIR / "X_train.csv")
y_train = pd.read_csv(DATA_DIR / "y_train.csv").squeeze()

train_data = X_train.copy()
train_data["Machine failure"] = y_train.to_numpy()

print("Training data shape:", train_data.shape)

# Configure PyCaret on training data
setup(
    data=train_data,
    target="Machine failure",
    session_id=42,
    fold=5,
    fix_imbalance=True,
    normalize=True,
    verbose=True
)

# Train Random Forest using cross-validation
rf_model = create_model("rf")

# Save the trained model and preprocessing pipeline
save_model(rf_model, str(MODEL_DIR / "random_forest_model"))

print("\nRandom Forest model saved successfully.")
