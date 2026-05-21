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

// Analytics event types
export interface AnalyticsEvent {
  name: string;
  data: Record<string, unknown>;
  timestamp: number;
}

export type EventData =
  | { risk_level: string; confidence: number; timestamp: string }
  | { message: string; source: string; timestamp: string }
  | { page: string; timestamp: string }
  | { form: string; action: string; timestamp: string }
  | Record<string, unknown>;

// Cache types
export interface CacheItem<T = unknown> {
  data: T;
  expiry: number;
}

// Form state types
export interface FormData extends AccidentData {}

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface FormTouched {
  [key: string]: boolean;
}

export interface FormState {
  data: FormData;
  errors: FormErrors;
  touched: FormTouched;
  isLoading: boolean;
}

// API Response Wrapper
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

// Context types
export interface AppContextType {
  prediction: PredictionResponse | null;
  health: HealthStatus | null;
  predict: (data: AccidentData) => Promise<PredictionResponse | null>;
  checkHealth: () => Promise<HealthStatus | null>;
  isLoading: boolean;
  error: string | null;
}

// Window type augmentation
export interface WindowWithGtag extends Window {
  gtag?: (...args: unknown[]) => void;
}
