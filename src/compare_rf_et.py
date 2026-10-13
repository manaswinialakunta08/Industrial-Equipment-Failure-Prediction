
from pathlib import Path
import pandas as pd

from pycaret.classification import load_model, predict_model
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix
)

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data" / "processed"
MODEL_DIR = PROJECT_ROOT / "models"

X_test = pd.read_csv(DATA_DIR / "X_test.csv")
y_test = pd.read_csv(DATA_DIR / "y_test.csv").squeeze()


def evaluate_model(model_name, model_file):
    model = load_model(str(MODEL_DIR / model_file))

    predictions = predict_model(model, data=X_test)
    y_pred = predictions["prediction_label"].astype(int)

    results = {
        "Model": model_name,
        "Accuracy": accuracy_score(y_test, y_pred),
        "Precision": precision_score(
            y_test, y_pred, zero_division=0
        ),
        "Recall": recall_score(
            y_test, y_pred, zero_division=0
        ),
        "F1-score": f1_score(
            y_test, y_pred, zero_division=0
        )
    }

    print(f"\n{'=' * 45}")
    print(model_name)
    print("=" * 45)

    for metric, value in results.items():
        if metric != "Model":
            print(f"{metric}: {value:.4f}")

    print("Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))

    return results


results = [
    evaluate_model("Extra Trees", "best_failure_model"),
    evaluate_model("Random Forest", "random_forest_model")
]

print("\nFINAL TEST-SET COMPARISON")
print(pd.DataFrame(results).to_string(index=False))

