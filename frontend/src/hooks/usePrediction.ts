"use client";

import { useState, useCallback } from "react";
import { AccidentData, PredictionResponse } from "@/types";
import { predictRisk } from "@/utils/api";

export function usePrediction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);

  const predict = useCallback(async (formData: AccidentData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await predictRisk(formData);
      setResult(response);
      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get prediction";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { predict, loading, error, result };
}
