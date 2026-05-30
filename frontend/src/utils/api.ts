import axios, { AxiosInstance, AxiosError } from "axios";
import * as Sentry from "@sentry/nextjs";
import { AccidentData, PredictionResponse, HealthStatus, ApiError } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const REQUEST_TIMEOUT = 15000; // 15 seconds

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: REQUEST_TIMEOUT,
      headers: {
        "Content-Type": "application/json",
        "X-Client-Version": "1.0.0",
      },
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    );
  }

  private handleError(error: AxiosError<ApiError>) {
    // Log to Sentry
    Sentry.captureException(error, {
      tags: {
        "error.type": "api_error",
        "error.status": error.response?.status,
      },
      extra: {
        url: error.config?.url,
        method: error.config?.method,
      },
    });

    // Create user-friendly error message
    let userMessage = "Something went wrong. Please try again.";

    if (error.response?.status === 400) {
      userMessage = "Invalid input. Please check your data.";
    } else if (error.response?.status === 404) {
      userMessage = "API endpoint not found. Backend may be down.";
    } else if (error.response?.status === 500) {
      userMessage = "Server error. Please try again later.";
    } else if (error.code === "ECONNABORTED") {
      userMessage = "Request timeout. Please check your connection.";
    } else if (error.message === "Network Error") {
      userMessage = "Network error. Please check your internet connection.";
    }

    const apiError = new Error(userMessage);
    Object.assign(apiError, { originalError: error });
    throw apiError;
  }

  async predict(data: AccidentData): Promise<PredictionResponse> {
    const response = await this.client.post<PredictionResponse>("/predict", data);
    return response.data;
  }

  async health(): Promise<HealthStatus> {
    try {
      const response = await this.client.get<HealthStatus>("/health");
      return response.data;
    } catch {
      // Return offline status instead of throwing
      return {
        status: "offline",
        model_loaded: false,
        model_features: 0,
        timestamp: new Date().toISOString(),
      };
    }
  }

  setBaseURL(url: string) {
    this.client.defaults.baseURL = url;
  }
}

export const apiClient = new ApiClient();

// Backward compatibility
export const predictRisk = (data: AccidentData) => apiClient.predict(data);
export const checkHealth = () => apiClient.health();

// Retry logic for failed requests
export async function retryRequest<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
    }
  }
  throw new Error("Max retries exceeded");
}

// Request debouncing to prevent duplicate submissions
export function createDebouncedRequest<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  delay = 300
) {
  let timeout: NodeJS.Timeout;

  return (...args: T): Promise<R> => {
    return new Promise((resolve, reject) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        fn(...args).then(resolve).catch(reject);
      }, delay);
    });
  };
}

export default apiClient;

