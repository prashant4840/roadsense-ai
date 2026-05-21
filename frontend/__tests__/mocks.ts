import { AccidentData, PredictionResponse, HealthStatus } from '@/types';

export const mockAccidentData: AccidentData = {
  hour: 14,
  is_weekend: 0,
  temperature: 25,
  vehicles_involved: 2,
  casualties: 1,
  is_peak_hour: 0,
  is_night: 0,
  road_type: 'highway',
  weather: 'clear',
  traffic_density: 'high',
  visibility: 'high',
};

export const mockPredictionResponse: PredictionResponse = {
  risk_level: 0.65,
  confidence: 0.87,
  factors: {
    weather: 0.25,
    traffic: 0.35,
    time: 0.15,
    road_type: 0.15,
    visibility: 0.1,
  },
};

export const mockHealthStatus: HealthStatus = {
  status: 'healthy',
  model_loaded: true,
  model_features: 19,
  timestamp: new Date().toISOString(),
};

export const mockOfflineHealthStatus: HealthStatus = {
  status: 'offline',
  model_loaded: false,
  model_features: 0,
  timestamp: new Date().toISOString(),
};

export const mockApiError = new Error('Failed to connect to API');

export const createMockPredictionResponse = (overrides?: Partial<PredictionResponse>): PredictionResponse => ({
  ...mockPredictionResponse,
  ...overrides,
});

export const createMockAccidentData = (overrides?: Partial<AccidentData>): AccidentData => ({
  ...mockAccidentData,
  ...overrides,
});

export const createMockHealthStatus = (overrides?: Partial<HealthStatus>): HealthStatus => ({
  ...mockHealthStatus,
  ...overrides,
});
