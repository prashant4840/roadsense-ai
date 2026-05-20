"use client";

import { useState, useEffect } from "react";
import { HealthStatus } from "@/types";
import { checkHealth } from "@/utils/api";

export function useHealth() {
  const [isHealthy, setIsHealthy] = useState(false);
  const [status, setStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const response = await checkHealth();
        setStatus(response);
        setIsHealthy(response.status === "healthy");
      } catch {
        setIsHealthy(false);
        setStatus(null);
      } finally {
        setLoading(false);
      }
    };

    check();
    const interval = setInterval(check, 30000); // Every 30s
    return () => clearInterval(interval);
  }, []);

  return { isHealthy, status, loading };
}
