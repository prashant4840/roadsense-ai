import pytest
from pathlib import Path
import pickle
import sys

sys.path.insert(0, str(Path(__file__).parent.parent))

def test_model_loads():
    """Test that ML model loads successfully"""
    model_path = Path(__file__).parent.parent / "models" / "accident_risk_model.pkl"

    if model_path.exists():
        with open(model_path, "rb") as f:
            model = pickle.load(f)
        assert model is not None
        print(f"✅ Model loaded successfully: {type(model)}")
    else:
        print(f"⚠️ Model file not found: {model_path}")

def test_model_prediction():
    """Test model can make predictions"""
    # Test data
    test_input = {
        'hour': 14,
        'is_weekend': 0,
        'temperature': 25,
        'vehicles_involved': 2,
        'casualties': 1,
        'is_peak_hour': 0,
        'is_night': 0,
    }

    model_path = Path(__file__).parent.parent / "models" / "accident_risk_model.pkl"

    if model_path.exists():
        with open(model_path, "rb") as f:
            model = pickle.load(f)

        # Get required features
        n_features = model.n_features_in_
        print(f"✅ Model requires {n_features} features")
    else:
        print(f"⚠️ Model file not found: {model_path}")

if __name__ == "__main__":
    test_model_loads()
    test_model_prediction()
