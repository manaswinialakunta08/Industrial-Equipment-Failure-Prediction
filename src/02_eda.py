
from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns


# --------------------------------------------------
# 1. PROJECT PATHS AND SETTINGS
# --------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_PATH = PROJECT_ROOT / "data" / "raw" / "ai4i2020.csv"
REPORTS_DIR = PROJECT_ROOT / "reports"

sns.set_theme(style="whitegrid")


# --------------------------------------------------
# 2. EXPLORATORY DATA ANALYSIS
# --------------------------------------------------

def main():

    # Create reports directory if it does not exist
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)

    # Load the dataset
    df = pd.read_csv(DATA_PATH)

    print("=" * 60)
    print("INDUSTRIAL EQUIPMENT FAILURE PREDICTION")
    print("EXPLORATORY DATA ANALYSIS")
    print("=" * 60)

    print("\nDataset loaded successfully!")
    print(f"Dataset shape: {df.shape}")

    # --------------------------------------------------
    # GRAPH 1: MACHINE FAILURE DISTRIBUTION
    # --------------------------------------------------

    print("\nGenerating Graph 1: Machine Failure Distribution")

    plt.figure(figsize=(7, 5))

    sns.countplot(data=df, x="Machine failure")

    plt.title("Machine Failure Distribution")
    plt.xlabel("Machine Failure (0 = No, 1 = Yes)")
    plt.ylabel("Number of Records")

    plt.tight_layout()

    plt.savefig(
        REPORTS_DIR / "01_failure_distribution.png",
        dpi=300,
        bbox_inches="tight",
    )

    plt.close()

    # --------------------------------------------------
    # GRAPH 2: NUMERICAL FEATURE DISTRIBUTIONS
    # --------------------------------------------------

    print("Generating Graph 2: Feature Distributions")

    numerical_features = [
        "Air temperature [K]",
        "Process temperature [K]",
        "Rotational speed [rpm]",
        "Torque [Nm]",
        "Tool wear [min]",
    ]

    df[numerical_features].hist(
        figsize=(14, 10),
        bins=30,
        edgecolor="black",
    )

    plt.suptitle(
        "Distribution of Machine Operating Conditions",
        fontsize=15,
    )

    plt.tight_layout()

    plt.savefig(
        REPORTS_DIR / "02_feature_distributions.png",
        dpi=300,
        bbox_inches="tight",
    )

    plt.close("all")

    # --------------------------------------------------
    # GRAPH 3: CORRELATION HEATMAP
    # --------------------------------------------------

    print("Generating Graph 3: Correlation Heatmap")

    correlation_columns = numerical_features + ["Machine failure"]

    correlation_matrix = df[correlation_columns].corr()

    plt.figure(figsize=(10, 7))

    sns.heatmap(
        correlation_matrix,
        annot=True,
        cmap="coolwarm",
        fmt=".2f",
        vmin=-1,
        vmax=1,
    )

    plt.title(
        "Correlation Between Operating Conditions and Machine Failure"
    )

    plt.tight_layout()

    plt.savefig(
        REPORTS_DIR / "03_correlation_heatmap.png",
        dpi=300,
        bbox_inches="tight",
    )

    plt.close()

    # --------------------------------------------------
    # GRAPH 4: MACHINE FAILURE BY PRODUCT TYPE
    # --------------------------------------------------

    print("Generating Graph 4: Failure by Product Type")

    plt.figure(figsize=(7, 5))

    sns.countplot(
        data=df,
        x="Type",
        hue="Machine failure",
    )

    plt.title("Machine Failure Counts by Product Type")
    plt.xlabel("Product Type")
    plt.ylabel("Number of Records")

    plt.legend(
        title="Machine Failure",
        labels=["No Failure", "Failure"],
    )

    plt.tight_layout()

    plt.savefig(
        REPORTS_DIR / "04_failure_by_type.png",
        dpi=300,
        bbox_inches="tight",
    )

    plt.close()

    # --------------------------------------------------
    # 5. COMPLETION MESSAGE
    # --------------------------------------------------

    print("\n" + "=" * 60)
    print("EXPLORATORY DATA ANALYSIS COMPLETED!")
    print("=" * 60)

    print("\nGenerated visualizations:")

    for image_path in sorted(REPORTS_DIR.glob("*.png")):
        print(f" - {image_path.name}")

    print(f"\nAll graphs are saved in:\n{REPORTS_DIR}")


# --------------------------------------------------
# 6. PROGRAM ENTRY POINT
# --------------------------------------------------

if __name__ == "__main__":
    main()
