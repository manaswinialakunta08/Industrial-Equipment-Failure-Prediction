
from pathlib import Path

import pandas as pd
from sklearn.model_selection import train_test_split

# Project root directory
PROJECT_ROOT = Path(__file__).resolve().parent.parent

# Dataset and output paths
DATA_PATH = PROJECT_ROOT / "data" / "raw" / "ai4i2020.csv"
OUTPUT_DIR = PROJECT_ROOT / "data" / "processed"


def main():
    # 1. Load dataset
    df = pd.read_csv(DATA_PATH)
    print("Dataset loaded successfully!")
    print("Original shape:", df.shape)

    # 2. Check data quality
    print("\nMissing values:", df.isnull().sum().sum())
    print("Duplicate rows:", df.duplicated().sum())

    # 3. Remove duplicate rows
    df = df.drop_duplicates()

    # 4. Separate target variable
    target = "Machine failure"
    y = df[target]

    # 5. Select useful input features
    columns_to_drop = [
        "UDI",
        "Product ID",
        "TWF",
        "HDF",
        "PWF",
        "OSF",
        "RNF",
        target
    ]

    X = df.drop(columns=columns_to_drop)

    print("\nSelected features:")
    print(X.columns.tolist())

    # 6. Split into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y
    )

    # 7. Create output folder
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # 8. Save the four datasets
    X_train.to_csv(OUTPUT_DIR / "X_train.csv", index=False)
    X_test.to_csv(OUTPUT_DIR / "X_test.csv", index=False)
    y_train.to_csv(OUTPUT_DIR / "y_train.csv", index=False)
    y_test.to_csv(OUTPUT_DIR / "y_test.csv", index=False)

    # 9. Display results
    print("\nPreprocessing completed successfully!")
    print("Training features:", X_train.shape)
    print("Testing features:", X_test.shape)

    print("\nTraining target distribution:")
    print(y_train.value_counts())

    print("\nTesting target distribution:")
    print(y_test.value_counts())

    print("\nSaved files to:", OUTPUT_DIR)


if __name__ == "__main__":
    main()

