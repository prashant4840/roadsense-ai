# RoadSense AI Backend - Deployment & API Guide

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run the API Server
```bash
# Make the startup script executable
chmod +x run_api.sh

# Start the server
./run_api.sh
```

Or directly with uvicorn:
```bash
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

### 3. Access the API
- **Interactive Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health
- **Root**: http://localhost:8000/

---

## API Endpoints

### Health Check
**GET** `/health`

Check API and model status.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_features": 19,
  "timestamp": "2026-05-20T09:16:05.216435"
}
```

---

### Root Endpoint
**GET** `/`

Get API information.

**Response:**
```json
{
  "message": "RoadSense AI Backend Running",
  "version": "1.0.0",
  "docs": "/docs",
  "health": "/health"
}
```

---

### Predict Accident Risk
**POST** `/predict`

Predict accident risk based on input features.

**Request:**
```json
{
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
```

**Response (200 OK):**
```json
{
  "prediction": "LOW RISK",
  "risk_level": 0,
  "confidence": 0.61,
  "timestamp": "2026-05-20T09:16:23.497725"
}
```

**Error Response (422 Unprocessable Entity):**
```json
{
  "detail": "Invalid value 'invalid_road' for feature 'road_type'. Allowed values: ['highway', 'rural', 'urban']"
}
```

---

## Request Field Specifications

### Numerical Fields
| Field | Type | Range | Description |
|-------|------|-------|-------------|
| `hour` | int | 0-23 | Hour of day |
| `is_weekend` | int | 0, 1 | 1 if weekend, 0 otherwise |
| `temperature` | float | -50 to 60 | Temperature in Celsius |
| `vehicles_involved` | int | ≥1 | Number of vehicles |
| `casualties` | int | ≥0 | Number of casualties |
| `is_peak_hour` | int | 0, 1 | 1 if peak hour, 0 otherwise |
| `is_night` | int | 0, 1 | 1 if night (20:00-5:00), 0 otherwise |

### Categorical Fields
| Field | Values | Description |
|-------|--------|-------------|
| `road_type` | highway, rural, urban | Type of road |
| `weather` | clear, fog, rain | Weather condition |
| `visibility` | high, low, medium | Visibility level |
| `traffic_density` | high, low, medium | Traffic density |

---

## Input Validation

The API validates all inputs before prediction:

✅ **Accepted:**
- All required fields present
- Numerical values within reasonable bounds
- Categorical values from allowed set
- Valid data types

❌ **Rejected (422):**
- Missing required fields
- Invalid categorical values
- Out-of-bounds numerical values
- Type mismatches
- Negative counts (vehicles, casualties)

### Example Validation Errors

**Missing Field:**
```json
{
  "detail": "Missing required numerical features: ['temperature']"
}
```

**Invalid Categorical:**
```json
{
  "detail": "Invalid value 'rain_heavy' for feature 'weather'. Allowed values: ['clear', 'fog', 'rain']"
}
```

**Out of Bounds:**
```json
{
  "detail": "Hour must be 0-23, got 25"
}
```

---

## Running Tests

### Manual Integration Tests
```bash
cd backend
python3 -m pytest test_api.py -v
```

### Quick Manual Test
```python
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

# Test health
response = client.get("/health")
assert response.status_code == 200

# Test valid prediction
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
assert "prediction" in response.json()

# Test invalid input
bad_payload = {**payload, "hour": 25}
response = client.post("/predict", json=bad_payload)
assert response.status_code == 422
```

---

## Environment Variables

```bash
# Model path (default: ../models/accident_risk_model.pkl)
export MODEL_PATH="path/to/model.pkl"

# Server host (default: 127.0.0.1)
export HOST="0.0.0.0"

# Server port (default: 8000)
export PORT="8000"

# Number of workers (default: 1)
export WORKERS="4"
```

---

## Production Deployment

### With Gunicorn
```bash
gunicorn backend.main:app \
    --workers 4 \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:8000
```

### With Docker
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### With Docker Compose
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - MODEL_PATH=/app/models/accident_risk_model.pkl
    volumes:
      - ./models:/app/models
```

---

## Architecture & Key Features

### ✅ Input Validation
All inputs are validated before preprocessing:
- Type checking (Pydantic)
- Range bounds checking
- Categorical value validation
- Missing field detection

### ✅ Feature Preprocessing
- Automatic one-hot encoding of categorical features
- Column alignment to match training order
- Uses `model.feature_names_in_` for consistency
- Handles missing categories gracefully

### ✅ Error Handling
- Clear validation error messages (422)
- Server error logging (500)
- Structured error responses
- Request/response logging

### ✅ Monitoring
- Health check endpoint
- Server startup logging
- Request logging with timestamps
- Confidence scores for predictions

---

## Troubleshooting

### Model Not Loading
```
❌ Failed to load model: FileNotFoundError
```
**Solution:** Check MODEL_PATH environment variable and file exists
```bash
export MODEL_PATH="../models/accident_risk_model.pkl"
```

### Port Already in Use
```
❌ Address already in use
```
**Solution:** Use a different port
```bash
export PORT=8001
./run_api.sh
```

### Import Errors
```
❌ ModuleNotFoundError: No module named 'fastapi'
```
**Solution:** Install dependencies
```bash
pip install -r requirements.txt
```

---

## API Changes Since v0.1

### v1.0.0 (Current)
- ✅ Comprehensive input validation
- ✅ Health check endpoint
- ✅ Better error messages
- ✅ Request/response logging
- ✅ CORS support
- ✅ Structured responses
- ✅ Confidence scores
- ✅ Type annotations
- ✅ Integration tests included

### Previous Limitations (v0.1) - NOW FIXED
- ❌ ~~Silent failures on invalid input~~ → Now rejects with 422
- ❌ ~~No bounds checking~~ → Now validates all ranges
- ❌ ~~Missing field errors unclear~~ → Now explicit validation messages
- ❌ ~~No health monitoring~~ → Now /health endpoint
- ❌ ~~No logging~~ → Now comprehensive logging

---

## Support

For issues or questions:
1. Check logs: Server logs all requests and errors
2. Use `/docs` for interactive API testing
3. Run integration tests: `pytest backend/test_api.py -v`
4. Check validation error messages for input issues
