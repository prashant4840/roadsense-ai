import os

CATEGORICAL_FEATURES = {
    'road_type': ['highway', 'rural', 'urban'],
    'weather': ['clear', 'fog', 'rain'],
    'visibility': ['high', 'low', 'medium'],
    'traffic_density': ['high', 'low', 'medium']
}

NUMERICAL_FEATURES = [
    'hour',
    'is_weekend',
    'temperature',
    'vehicles_involved',
    'casualties',
    'is_peak_hour',
    'is_night'
]

MODEL_PATH = os.getenv('MODEL_PATH', '../models/accident_risk_model.pkl')
