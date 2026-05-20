import axios, { AxiosInstance } from "axios";
import { AccidentData, PredictionResponse, HealthStatus, ApiError } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const predictRisk = async (
  data: AccidentData
): Promise<PredictionResponse> => {
  try {
    const response = await apiClient.post<PredictionResponse>("/predict", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiError;
      throw new Error(
        typeof errorData?.detail === "string"
          ? errorData.detail
          : "Failed to predict risk"
      );
    }
    throw error;
  }
};

export const checkHealth = async (): Promise<HealthStatus> => {
  try {
    const response = await apiClient.get<HealthStatus>("/health");
    return response.data;
  } catch (error) {
    throw new Error("API health check failed");
  }
};

export default apiClient;
