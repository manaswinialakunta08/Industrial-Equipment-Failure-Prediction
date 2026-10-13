
from pathlib import Path
import pandas as pd

from pycaret.classification import (
    setup,
    create_model,
    finalize_model,
    save_model
)

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data" / "processed"
MODEL_DIR = PROJECT_ROOT / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

# Load all training data
X_train = pd.read_csv(DATA_DIR / "X_train.csv")
y_train = pd.read_csv(DATA_DIR / "y_train.csv").squeeze()

train_data = X_train.copy()
train_data["Machine failure"] = y_train.to_numpy()

print("Training rows:", len(train_data))
print("Failure records:", int(y_train.sum()))

# Configure the ML pipeline
setup(
    data=train_data,
    target="Machine failure",
    session_id=42,
    fold=5,
    fix_imbalance=True,
    normalize=True,
    verbose=False
)

# Train Extra Trees
print("\nTraining Extra Trees...")
model = create_model("et")

# Fit the final pipeline on all available training data
print("\nFinalizing model on all training data...")
final_model = finalize_model(model)

# Save without overwriting the baseline model
save_model(
    final_model,
    str(MODEL_DIR / "final_extra_trees_threshold_045")
)

print("\nFinal Extra Trees model saved successfully.")
print("Candidate threshold: 0.45")
print("The test set was not used for training.")
