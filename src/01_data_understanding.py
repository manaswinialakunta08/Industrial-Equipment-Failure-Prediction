
from pathlib import Path

import pandas as pd


# Project root directory
PROJECT_ROOT = Path(__file__).resolve().parent.parent

# Dataset location
DATA_PATH = PROJECT_ROOT / "data" / "raw" / "ai4i2020.csv"


def main():
    # Load the dataset
    df = pd.read_csv(DATA_PATH)

    print("=" * 60)
    print("INDUSTRIAL EQUIPMENT FAILURE PREDICTION")
    print("STEP 1: DATA UNDERSTANDING")
    print("=" * 60)

    # 1. Dataset dimensions
    print("\n1. DATASET SHAPE")
    print(f"Number of records: {df.shape[0]}")
    print(f"Number of columns: {df.shape[1]}")

    # 2. Column names
    print("\n2. COLUMN NAMES")
    for column in df.columns:
        print(column)

    # 3. Dataset information
    print("\n3. DATASET INFORMATION")
    df.info()

    # 4. First five records
    print("\n4. FIRST FIVE RECORDS")
    print(df.head().to_string(index=False))

    # 5. Missing values
    print("\n5. MISSING VALUES")
    print(df.isnull().sum())

    # 6. Duplicate records
    print("\n6. DUPLICATE RECORDS")
    print(df.duplicated().sum())

    # 7. Statistical summary
    print("\n7. STATISTICAL SUMMARY")
    print(df.describe().round(2).to_string())

    # 8. Machine failure distribution
    print("\n8. MACHINE FAILURE DISTRIBUTION")
    print(df["Machine failure"].value_counts())

    print("\nFAILURE PERCENTAGES")
    print(
        (df["Machine failure"].value_counts(normalize=True) * 100)
        .round(2)
        .to_string()
    )


if __name__ == "__main__":
    main()
