import pytest
from fastapi.testclient import TestClient
from main import app
from utils.preprocessing import PreprocessingError, validate_input
from config import CATEGORICAL_FEATURES, NUMERICAL_FEATURES

client = TestClient(app)


class TestHealthEndpoint:
    """Test health check endpoint."""

    def test_health_check_success(self):
        """Health endpoint should return 200 with model status."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["model_loaded"] is True
        assert data["model_features"] == 19


class TestHomeEndpoint:
    """Test root endpoint."""

    def test_home_success(self):
        """Home endpoint should return API info."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "docs" in data
        assert "health" in data


class TestValidPredictions:
    """Test valid prediction requests."""

    def test_predict_low_risk(self):
        """Should predict LOW RISK for safe conditions."""
        payload = {
            "hour": 14,
            "is_weekend": 0,
            "temperature": 28.5,
            "vehicles_involved": 2,
            "casualties": 1,
            "is_peak_hour": 1,
            "is_night": 0,
            "road_type": "highway",
            "weather": "clear",
            "traffic_density": "high",
            "visibility": "high"
        }
        response = client.post("/predict", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["prediction"] in ["HIGH RISK", "LOW RISK"]
        assert data["risk_level"] in [0, 1]
        assert 0 <= data["confidence"] <= 1

    def test_predict_high_risk(self):
        """Should predict HIGH RISK for risky conditions."""
        payload = {
            "hour": 2,  # Night time
            "is_weekend": 1,
            "temperature": 15.0,
            "vehicles_involved": 4,
            "casualties": 2,
            "is_peak_hour": 0,
            "is_night": 1,
            "road_type": "rural",
            "weather": "rain",
            "traffic_density": "high",
            "visibility": "low"
        }
        response = client.post("/predict", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "prediction" in data
        assert "confidence" in data

    def test_predict_all_categorical_values(self):
        """Should handle all valid categorical combinations."""
        base_payload = {
            "hour": 14,
            "is_weekend": 0,
            "temperature": 25.0,
            "vehicles_involved": 2,
            "casualties": 1,
            "is_peak_hour": 1,
            "is_night": 0,
        }

        # Test all road types
        for road_type in ["highway", "rural", "urban"]:
            payload = {**base_payload, "road_type": road_type, "weather": "clear", "traffic_density": "high", "visibility": "high"}
            response = client.post("/predict", json=payload)
            assert response.status_code == 200

        # Test all weather values
        for weather in ["clear", "fog", "rain"]:
            payload = {**base_payload, "road_type": "urban", "weather": weather, "traffic_density": "high", "visibility": "high"}
            response = client.post("/predict", json=payload)
            assert response.status_code == 200

        # Test all visibility values
        for visibility in ["high", "low", "medium"]:
            payload = {**base_payload, "road_type": "urban", "weather": "clear", "traffic_density": "high", "visibility": visibility}
            response = client.post("/predict", json=payload)
            assert response.status_code == 200

        # Test all traffic density values
        for density in ["high", "low", "medium"]:
            payload = {**base_payload, "road_type": "urban", "weather": "clear", "traffic_density": density, "visibility": "high"}
            response = client.post("/predict", json=payload)
            assert response.status_code == 200


class TestInvalidInput:
    """Test error handling for invalid input."""

    def test_missing_numerical_feature(self):
        """Should reject missing numerical features."""
        payload = {
            "hour": 14,
            "is_weekend": 0,
            # "temperature": MISSING!
            "vehicles_involved": 2,
            "casualties": 1,
            "is_peak_hour": 1,
            "is_night": 0,
            "road_type": "highway",
            "weather": "clear",
            "traffic_density": "high",
            "visibility": "high"
        }
        response = client.post("/predict", json=payload)
        assert response.status_code == 422

    def test_missing_categorical_feature(self):
        """Should reject missing categorical features."""
        payload = {
            "hour": 14,
            "is_weekend": 0,
            "temperature": 28.5,
            "vehicles_involved": 2,
            "casualties": 1,
            "is_peak_hour": 1,
            "is_night": 0,
            # "road_type": MISSING!
            "weather": "clear",
            "traffic_density": "high",
            "visibility": "high"
        }
        response = client.post("/predict", json=payload)
        assert response.status_code == 422

    def test_invalid_categorical_value(self):
        """Should reject invalid categorical values."""
        payload = {
            "hour": 14,
            "is_weekend": 0,
            "temperature": 28.5,
            "vehicles_involved": 2,
            "casualties": 1,
            "is_peak_hour": 1,
            "is_night": 0,
            "road_type": "invalid_road_type",  # INVALID!
            "weather": "clear",
            "traffic_density": "high",
            "visibility": "high"
        }
        response = client.post("/predict", json=payload)
        assert response.status_code == 422
        assert "Invalid value" in response.json()["detail"]

    def test_invalid_hour_bounds(self):
        """Should reject hour outside 0-23."""
        payload = {
            "hour": 25,  # INVALID!
            "is_weekend": 0,
            "temperature": 28.5,
            "vehicles_involved": 2,
            "casualties": 1,
            "is_peak_hour": 1,
            "is_night": 0,
            "road_type": "highway",
            "weather": "clear",
            "traffic_density": "high",
            "visibility": "high"
        }
        response = client.post("/predict", json=payload)
        assert response.status_code == 422

    def test_invalid_temperature_bounds(self):
        """Should reject unrealistic temperatures."""
        payload = {
            "hour": 14,
            "is_weekend": 0,
            "temperature": 100.0,  # INVALID!
            "vehicles_involved": 2,
            "casualties": 1,
            "is_peak_hour": 1,
            "is_night": 0,
            "road_type": "highway",
            "weather": "clear",
            "traffic_density": "high",
            "visibility": "high"
        }
        response = client.post("/predict", json=payload)
        assert response.status_code == 422

    def test_invalid_binary_fields(self):
        """Should reject binary fields with values other than 0/1."""
        payload = {
            "hour": 14,
            "is_weekend": 2,  # INVALID! Must be 0 or 1
            "temperature": 28.5,
            "vehicles_involved": 2,
            "casualties": 1,
            "is_peak_hour": 1,
            "is_night": 0,
            "road_type": "highway",
            "weather": "clear",
            "traffic_density": "high",
            "visibility": "high"
        }
        response = client.post("/predict", json=payload)
        assert response.status_code == 422

    def test_negative_casualties(self):
        """Should reject negative casualty counts."""
        payload = {
            "hour": 14,
            "is_weekend": 0,
            "temperature": 28.5,
            "vehicles_involved": 2,
            "casualties": -1,  # INVALID!
            "is_peak_hour": 1,
            "is_night": 0,
            "road_type": "highway",
            "weather": "clear",
            "traffic_density": "high",
            "visibility": "high"
        }
        response = client.post("/predict", json=payload)
        assert response.status_code == 422


class TestInputValidationUnit:
    """Unit tests for input validation function."""

    def test_validate_input_success(self):
        """Should not raise on valid input."""
        valid_input = {
            "hour": 14,
            "is_weekend": 0,
            "temperature": 28.5,
            "vehicles_involved": 2,
            "casualties": 1,
            "is_peak_hour": 1,
            "is_night": 0,
            "road_type": "highway",
            "weather": "clear",
            "traffic_density": "high",
            "visibility": "high"
        }
        # Should not raise
        validate_input(valid_input, CATEGORICAL_FEATURES, NUMERICAL_FEATURES)

    def test_validate_input_missing_numerical(self):
        """Should raise on missing numerical feature."""
        invalid_input = {
            "hour": 14,
            # Missing temperature
            "is_weekend": 0,
            "vehicles_involved": 2,
            "casualties": 1,
            "is_peak_hour": 1,
            "is_night": 0,
            "road_type": "highway",
            "weather": "clear",
            "traffic_density": "high",
            "visibility": "high"
        }
        with pytest.raises(PreprocessingError) as exc_info:
            validate_input(invalid_input, CATEGORICAL_FEATURES, NUMERICAL_FEATURES)
        assert "Missing required numerical features" in str(exc_info.value)

    def test_validate_input_invalid_categorical(self):
        """Should raise on invalid categorical value."""
        invalid_input = {
            "hour": 14,
            "is_weekend": 0,
            "temperature": 28.5,
            "vehicles_involved": 2,
            "casualties": 1,
            "is_peak_hour": 1,
            "is_night": 0,
            "road_type": "invalid",  # INVALID!
            "weather": "clear",
            "traffic_density": "high",
            "visibility": "high"
        }
        with pytest.raises(PreprocessingError) as exc_info:
            validate_input(invalid_input, CATEGORICAL_FEATURES, NUMERICAL_FEATURES)
        assert "Invalid value" in str(exc_info.value)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
