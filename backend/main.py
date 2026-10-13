
from pathlib import Path

import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pycaret.classification import load_model, predict_model

# Project paths
PROJECT_ROOT = Path(__file__).resolve().parent.parent
MODEL_PATH = (
    PROJECT_ROOT
    / "models"
    / "final_extra_trees_threshold_045"
)

THRESHOLD = 0.45

# Load the saved model once when the API starts
model = load_model(str(MODEL_PATH))

app = FastAPI(
    title="Industrial Equipment Failure Prediction API",
    description="Predict machine failure risk from sensor readings.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class MachineData(BaseModel):
    machine_type: str = Field(pattern="^[LMH]$")
    air_temperature: float = Field(ge=250, le=350)
    process_temperature: float = Field(ge=250, le=400)
    rotational_speed: int = Field(gt=0, le=10000)
    torque: float = Field(ge=0, le=200)
    tool_wear: int = Field(ge=0, le=300)


@app.get("/")
def home():
    return {
        "message": "Industrial Equipment Failure Prediction API",
        "status": "running",
        "docs": "/docs",
    }


@app.post("/predict")
def predict_failure(data: MachineData):
    if data.process_temperature < data.air_temperature:
        raise HTTPException(
            status_code=422,
            detail="Process temperature must be at least the air temperature.",
        )

    machine = pd.DataFrame([{
        "Type": data.machine_type,
        "Air temperature [K]": data.air_temperature,
        "Process temperature [K]": data.process_temperature,
        "Rotational speed [rpm]": data.rotational_speed,
        "Torque [Nm]": data.torque,
        "Tool wear [min]": data.tool_wear,
    }])

    result = predict_model(model, data=machine, raw_score=True)
    probability = float(result["prediction_score_1"].iloc[0])
    prediction = probability >= THRESHOLD

    return {
        "failure_probability": round(probability, 4),
        "threshold": THRESHOLD,
        "prediction": (
            "FAILURE RISK DETECTED"
            if prediction
            else "NO FAILURE FLAGGED"
        ),
        "failure_risk_detected": prediction,
    }
