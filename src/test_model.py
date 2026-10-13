
from pathlib import Path
import pandas as pd
from pycaret.classification import load_model, predict_model

PROJECT_ROOT = Path(__file__).resolve().parent.parent
MODEL_PATH = PROJECT_ROOT / "models" / "final_extra_trees_threshold_045"

THRESHOLD = 0.45

model = load_model(str(MODEL_PATH))

# Example machine sensor readings
machine = pd.DataFrame([{
    "Type": "L",
    "Air temperature [K]": 303.0,
    "Process temperature [K]": 313.0,
    "Rotational speed [rpm]": 1400,
    "Torque [Nm]": 55.0,
    "Tool wear [min]": 240
}])

result = predict_model(model, data=machine, raw_score=True)

probability = float(result["prediction_score_1"].iloc[0])
prediction = int(probability >= THRESHOLD)

print("\n--- MACHINE FAILURE TEST ---")
print("Sensor readings:")
print(machine.to_string(index=False))
print(f"\nFailure probability score: {probability:.4f}")
print(f"Decision threshold: {THRESHOLD:.2f}")

if prediction == 1:
    print("Prediction: FAILURE RISK DETECTED")
else:
    print("Prediction: NO FAILURE FLAGGED")

print("\nTest completed.")
