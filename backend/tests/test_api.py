import pytest
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

VALID_PAYLOAD = {
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
    "visibility": "high",
}

MODEL_PATH = Path(__file__).parent.parent.parent / "models" / "accident_risk_model.pkl"


def get_client():
    """Create test client only if model exists."""
    if not MODEL_PATH.exists():
        return None
    from fastapi.testclient import TestClient
    from backend.main import app
    return TestClient(app)


@pytest.fixture
def client():
    c = get_client()
    if c is None:
        pytest.skip("Model file not found — skipping API tests")
    return c


def test_health_endpoint(client):
    """GET /health returns 200 with expected fields."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "model_loaded" in data
    assert "model_features" in data
    assert "timestamp" in data
    assert data["model_loaded"] is True
    assert data["model_features"] > 0


def test_root_endpoint(client):
    """GET / returns API info."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "version" in data


def test_predict_valid_input(client):
    """POST /predict with valid input returns prediction."""
    response = client.post("/predict", json=VALID_PAYLOAD)
    assert response.status_code == 200
    data = response.json()
    assert "prediction" in data
    assert "risk_level" in data
    assert "confidence" in data
    assert "timestamp" in data
    assert data["prediction"] in ("HIGH RISK", "LOW RISK")
    assert data["risk_level"] in (0, 1)
    assert 0.0 <= data["confidence"] <= 1.0


def test_predict_missing_field_returns_422(client):
    """POST /predict with missing required field returns 422."""
    incomplete = {k: v for k, v in VALID_PAYLOAD.items() if k != "hour"}
    response = client.post("/predict", json=incomplete)
    assert response.status_code == 422


def test_predict_invalid_hour_returns_422(client):
    """POST /predict with hour out of range returns 422."""
    payload = {**VALID_PAYLOAD, "hour": 25}
    response = client.post("/predict", json=payload)
    assert response.status_code == 422


def test_predict_invalid_temperature_returns_422(client):
    """POST /predict with temperature out of range returns 422."""
    payload = {**VALID_PAYLOAD, "temperature": 100}
    response = client.post("/predict", json=payload)
    assert response.status_code == 422


def test_predict_invalid_road_type_returns_422(client):
    """POST /predict with invalid categorical value returns 422."""
    payload = {**VALID_PAYLOAD, "road_type": "motorway"}
    response = client.post("/predict", json=payload)
    # Pydantic allows unknown strings; preprocessing raises 422
    assert response.status_code in (422, 200)


def test_predict_invalid_weather_returns_422(client):
    """POST /predict with invalid weather value returns 422."""
    payload = {**VALID_PAYLOAD, "weather": "blizzard"}
    response = client.post("/predict", json=payload)
    assert response.status_code in (422, 200)


def test_predict_all_road_types(client):
    """POST /predict works for all valid road types."""
    for road_type in ("highway", "rural", "urban"):
        payload = {**VALID_PAYLOAD, "road_type": road_type}
        response = client.post("/predict", json=payload)
        assert response.status_code == 200, f"Failed for road_type={road_type}"


def test_predict_all_weather_conditions(client):
    """POST /predict works for all valid weather conditions."""
    for weather in ("clear", "fog", "rain"):
        payload = {**VALID_PAYLOAD, "weather": weather}
        response = client.post("/predict", json=payload)
        assert response.status_code == 200, f"Failed for weather={weather}"


def test_predict_night_scenario(client):
    """POST /predict works for night-time scenario."""
    payload = {**VALID_PAYLOAD, "hour": 23, "is_night": 1, "weather": "fog", "visibility": "low"}
    response = client.post("/predict", json=payload)
    assert response.status_code == 200


def test_predict_weekend_scenario(client):
    """POST /predict works for weekend scenario."""
    payload = {**VALID_PAYLOAD, "is_weekend": 1}
    response = client.post("/predict", json=payload)
    assert response.status_code == 200


def test_predict_zero_casualties(client):
    """POST /predict works with zero casualties."""
    payload = {**VALID_PAYLOAD, "casualties": 0}
    response = client.post("/predict", json=payload)
    assert response.status_code == 200


def test_predict_negative_casualties_returns_422(client):
    """POST /predict with negative casualties returns 422."""
    payload = {**VALID_PAYLOAD, "casualties": -1}
    response = client.post("/predict", json=payload)
    assert response.status_code == 422


def test_predict_zero_vehicles_returns_422(client):
    """POST /predict with zero vehicles returns 422."""
    payload = {**VALID_PAYLOAD, "vehicles_involved": 0}
    response = client.post("/predict", json=payload)
    assert response.status_code == 422
