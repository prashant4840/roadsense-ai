"use client";

import { useHealth } from "@/hooks/useHealth";

export function Header() {
  const { isHealthy, loading } = useHealth();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">🛣️ RoadSense AI</h1>
            <p className="text-blue-100">Accident Risk Prediction System</p>
          </div>
          <HealthStatus isHealthy={isHealthy} loading={loading} />
        </div>
      </div>
    </header>
  );
}

function HealthStatus({
  isHealthy,
  loading,
}: {
  isHealthy: boolean;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-blue-100">
        <div className="w-3 h-3 rounded-full bg-blue-300 animate-pulse" />
        <span>Checking...</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 ${
        isHealthy ? "text-green-300" : "text-red-300"
      }`}
    >
      <div
        className={`w-3 h-3 rounded-full ${
          isHealthy ? "bg-green-300" : "bg-red-300"
        }`}
      />
      <span>{isHealthy ? "✅ API Online" : "❌ API Offline"}</span>
    </div>
  );
}
