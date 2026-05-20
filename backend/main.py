from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import logging
import os
from datetime import datetime
import sys

# Handle imports whether running as module or script
try:
    from config import CATEGORICAL_FEATURES, NUMERICAL_FEATURES, MODEL_PATH
    from utils.preprocessing import prepare_inference_data, PreprocessingError
except ImportError:
    # If relative imports fail, add current dir to path
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from config import CATEGORICAL_FEATURES, NUMERICAL_FEATURES, MODEL_PATH
    from utils.preprocessing import prepare_inference_data, PreprocessingError

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="RoadSense AI API",
    description="AI-Powered Road Accident Risk Prediction",
    version="1.0.0"
)

# Add CORS middleware for frontend compatibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained model
try:
    model = joblib.load(MODEL_PATH)
    logger.info(f"Model loaded successfully from {MODEL_PATH}")
except Exception as e:
    logger.error(f"Failed to load model: {e}")
    raise


class AccidentData(BaseModel):
    hour: int = Field(..., ge=0, le=23, description="Hour of day (0-23)")
    is_weekend: int = Field(..., ge=0, le=1, description="1 if weekend, 0 otherwise")
    temperature: float = Field(..., ge=-50, le=60, description="Temperature in Celsius (-50 to 60)")
    vehicles_involved: int = Field(..., ge=1, description="Number of vehicles involved")
    casualties: int = Field(..., ge=0, description="Number of casualties")
    is_peak_hour: int = Field(..., ge=0, le=1, description="1 if peak hour, 0 otherwise")
    is_night: int = Field(..., ge=0, le=1, description="1 if night (20:00-5:00), 0 otherwise")

    road_type: str = Field(..., description="Type of road: highway, rural, or urban")
    weather: str = Field(..., description="Weather condition: clear, fog, or rain")
    traffic_density: str = Field(..., description="Traffic density: high, low, or medium")
    visibility: str = Field(..., description="Visibility: high, low, or medium")

    class Config:
        json_schema_extra = {
            "example": {
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
        }


class PredictionResponse(BaseModel):
    prediction: str
    risk_level: int
    confidence: float
    timestamp: str


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_features: int
    timestamp: str


@app.get("/health", response_model=HealthResponse, tags=["Status"])
def health_check():
    """
    Health check endpoint for monitoring API status.
    """
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "model_features": len(model.feature_names_in_) if model else 0,
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/", tags=["Info"])
def home():
    """Root endpoint with API information."""
    return {
        "message": "RoadSense AI Backend Running",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }


@app.post("/predict", response_model=PredictionResponse, tags=["Prediction"])
def predict(data: AccidentData):
    """
    Predict accident risk based on input features.

    Uses the trained Random Forest model to classify accident risk as HIGH or LOW.
    Feature preprocessing is handled by prepare_inference_data() which ensures
    proper one-hot encoding and column alignment with model expectations.

    **Input Validation:**
    - All required fields must be provided
    - Categorical values must be from allowed set
    - Numerical values must be within reasonable bounds
    - Missing or invalid input returns 422 Unprocessable Entity

    **Returns:**
    - prediction: "HIGH RISK" or "LOW RISK"
    - risk_level: Numeric prediction (0=LOW, 1=HIGH)
    - confidence: Model's confidence score (0-1)
    - timestamp: Server timestamp of prediction
    """
    try:
        logger.info(f"Prediction request received: hour={data.hour}, weather={data.weather}")

        # Preprocess input with validation
        df = prepare_inference_data(
            raw_input=data.dict(),
            model=model,
            categorical_mappings=CATEGORICAL_FEATURES,
            numerical_features=NUMERICAL_FEATURES
        )

        # Generate prediction
        prediction = model.predict(df)[0]
        probabilities = model.predict_proba(df)[0]

        # Format response
        result = "HIGH RISK" if prediction == 1 else "LOW RISK"
        confidence = float(probabilities[int(prediction)])

        response = {
            "prediction": result,
            "risk_level": int(prediction),
            "confidence": round(confidence, 4),
            "timestamp": datetime.utcnow().isoformat()
        }

        logger.info(f"Prediction generated: {result} (confidence: {confidence:.4f})")
        return response

    except PreprocessingError as e:
        logger.warning(f"Input validation failed: {str(e)}")
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"Prediction failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Prediction failed - internal server error")

