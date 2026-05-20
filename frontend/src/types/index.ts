export interface AccidentData {
  hour: number;
  is_weekend: 0 | 1;
  temperature: number;
  vehicles_involved: number;
  casualties: number;
  is_peak_hour: 0 | 1;
  is_night: 0 | 1;
  road_type: "highway" | "rural" | "urban";
  weather: "clear" | "fog" | "rain";
  traffic_density: "high" | "low" | "medium";
  visibility: "high" | "low" | "medium";
}

export interface PredictionResponse {
  prediction: "HIGH RISK" | "LOW RISK";
  risk_level: 0 | 1;
  confidence: number;
  timestamp: string;
}

export interface HealthStatus {
  status: string;
  model_loaded: boolean;
  model_features: number;
  timestamp: string;
}

export interface ApiError {
  detail: string | { [key: string]: string }[];
}
