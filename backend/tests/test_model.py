import pytest
import joblib
import sys
import numpy as np
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

MODEL_PATH = Path(__file__).parent.parent.parent / "models" / "accident_risk_model.pkl"


@pytest.fixture(scope="module")
def model():
    """Load model once for all tests in this module."""
    if not MODEL_PATH.exists():
        pytest.skip(f"Model file not found at {MODEL_PATH}")
    return joblib.load(MODEL_PATH)


def test_model_loads(model):
    """Model loads and is not None."""
    assert model is not None


def test_model_has_feature_names(model):
    """Model exposes feature_names_in_ attribute."""
    assert hasattr(model, "feature_names_in_"), "Model must have feature_names_in_ attribute"
    assert len(model.feature_names_in_) > 0


def test_model_feature_count(model):
    """Model expects exactly 19 features."""
    assert model.n_features_in_ == 19, (
        f"Expected 19 features, got {model.n_features_in_}"
    )


def test_model_has_predict(model):
    """Model has predict method."""
    assert hasattr(model, "predict")
    assert callable(model.predict)


def test_model_has_predict_proba(model):
    """Model has predict_proba method."""
    assert hasattr(model, "predict_proba")
    assert callable(model.predict_proba)


def test_model_prediction_shape(model):
    """Model returns correct output shape for single sample."""
    import pandas as pd
    from backend.config import CATEGORICAL_FEATURES, NUMERICAL_FEATURES
    from backend.utils.preprocessing import prepare_inference_data

    sample = {
        "hour": 14,
        "is_weekend": 0,
        "temperature": 25.0,
        "vehicles_involved": 2,
        "casualties": 1,
        "is_peak_hour": 0,
        "is_night": 0,
        "road_type": "highway",
        "weather": "clear",
        "traffic_density": "high",
        "visibility": "high",
    }

    df = prepare_inference_data(sample, model, CATEGORICAL_FEATURES, NUMERICAL_FEATURES)
    prediction = model.predict(df)
    probabilities = model.predict_proba(df)

    assert prediction.shape == (1,), f"Expected shape (1,), got {prediction.shape}"
    assert probabilities.shape == (1, 2), f"Expected shape (1, 2), got {probabilities.shape}"
    assert prediction[0] in (0, 1), f"Prediction must be 0 or 1, got {prediction[0]}"
    assert 0.0 <= probabilities[0].sum() <= 1.01, "Probabilities must sum to ~1.0"


def test_model_prediction_binary_output(model):
    """Model only outputs 0 or 1."""
    import pandas as pd
    from backend.config import CATEGORICAL_FEATURES, NUMERICAL_FEATURES
    from backend.utils.preprocessing import prepare_inference_data

    test_cases = [
        {"hour": 2, "is_weekend": 1, "temperature": 5.0, "vehicles_involved": 3,
         "casualties": 2, "is_peak_hour": 0, "is_night": 1,
         "road_type": "highway", "weather": "fog", "traffic_density": "high", "visibility": "low"},
        {"hour": 10, "is_weekend": 0, "temperature": 25.0, "vehicles_involved": 1,
         "casualties": 0, "is_peak_hour": 0, "is_night": 0,
         "road_type": "urban", "weather": "clear", "traffic_density": "low", "visibility": "high"},
    ]

    for case in test_cases:
        df = prepare_inference_data(case, model, CATEGORICAL_FEATURES, NUMERICAL_FEATURES)
        pred = model.predict(df)[0]
        assert pred in (0, 1), f"Expected 0 or 1, got {pred}"


def test_preprocessing_column_alignment(model):
    """Preprocessing aligns columns to model's expected order."""
    from backend.config import CATEGORICAL_FEATURES, NUMERICAL_FEATURES
    from backend.utils.preprocessing import prepare_inference_data

    sample = {
        "hour": 14, "is_weekend": 0, "temperature": 25.0,
        "vehicles_involved": 2, "casualties": 1, "is_peak_hour": 0, "is_night": 0,
        "road_type": "highway", "weather": "clear",
        "traffic_density": "high", "visibility": "high",
    }

    df = prepare_inference_data(sample, model, CATEGORICAL_FEATURES, NUMERICAL_FEATURES)
    assert list(df.columns) == list(model.feature_names_in_), (
        "Column order must match model.feature_names_in_"
    )
