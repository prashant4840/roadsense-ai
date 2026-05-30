#!/bin/bash

# RoadSense AI API Startup Script
# This script starts the FastAPI server for the RoadSense AI backend

set -e

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found. Create one if needed for API keys."
fi

# Check if model exists
if [ ! -f models/accident_risk_model.pkl ]; then
    echo "❌ Error: Model file not found at models/accident_risk_model.pkl"
    exit 1
fi

echo "=========================================="
echo "🚀 RoadSense AI Backend"
echo "=========================================="
echo ""

# Get environment variables
MODEL_PATH="${MODEL_PATH:-models/accident_risk_model.pkl}"
HOST="${HOST:-127.0.0.1}"
PORT="${PORT:-8000}"
WORKERS="${WORKERS:-1}"

echo "📦 Environment:"
echo "   MODEL_PATH: $MODEL_PATH"
echo "   HOST: $HOST"
echo "   PORT: $PORT"
echo "   WORKERS: $WORKERS"
echo ""

# Start the server
echo "🔧 Starting FastAPI server..."
echo "   Docs available at: http://$HOST:$PORT/docs"
echo "   Health check at: http://$HOST:$PORT/health"
echo ""

# Use --reload only in development
RELOAD_FLAG=""
if [ "${ENV:-development}" = "development" ]; then
    RELOAD_FLAG="--reload"
fi

uvicorn backend.main:app \
    --host "$HOST" \
    --port "$PORT" \
    --workers "$WORKERS" \
    $RELOAD_FLAG

echo ""
echo "✅ Server started successfully!"
