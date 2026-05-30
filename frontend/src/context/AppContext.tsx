"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { usePrediction } from "@/hooks/usePrediction";
import { useHealth } from "@/hooks/useHealth";
import { PredictionResponse, AccidentData } from "@/types";

interface AppContextType {
  prediction: {
    loading: boolean;
    error: string | null;
    result: PredictionResponse | null;
    predict: (data: AccidentData) => Promise<PredictionResponse | null>;
  };
  health: {
    isHealthy: boolean;
    loading: boolean;
    status: ReturnType<typeof useHealth>["status"];
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const prediction = usePrediction();
  const health = useHealth();

  return (
    <AppContext.Provider
      value={{
        prediction,
        health: {
          isHealthy: health.isHealthy,
          loading: health.loading,
          status: health.status,
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
