"use client";

import { PredictionResponse } from "@/types";

export function RiskDisplay({ prediction, risk_level, confidence, timestamp }: PredictionResponse) {
  const isHighRisk = risk_level === 1;

  return (
    <div
      className={`p-8 rounded-lg shadow-lg ${
        isHighRisk ? "bg-red-50 border-2 border-red-300" : "bg-green-50 border-2 border-green-300"
      }`}
    >
      <div className="flex items-center gap-6">
        <div
          className={`text-7xl ${
            isHighRisk ? "text-red-600" : "text-green-600"
          }`}
        >
          {isHighRisk ? "⚠️" : "✅"}
        </div>
        <div>
          <h2 className={`text-4xl font-bold ${isHighRisk ? "text-red-600" : "text-green-600"}`}>
            {prediction}
          </h2>
          <p className="text-gray-600 text-lg">
            Confidence: <span className="font-semibold">{(confidence * 100).toFixed(1)}%</span>
          </p>
          <p className="text-sm text-gray-500">
            {new Date(timestamp).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="mt-8">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold">Model Confidence</span>
          <span className="font-semibold">{(confidence * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              isHighRisk ? "bg-red-600" : "bg-green-600"
            }`}
            style={{ width: `${confidence * 100}%` }}
          />
        </div>
      </div>

      {/* Risk Assessment Details */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div
          className={`p-4 rounded ${
            isHighRisk ? "bg-red-100" : "bg-green-100"
          }`}
        >
          <p className="text-xs text-gray-600 uppercase font-semibold">Risk Level</p>
          <p className={`text-xl font-bold ${isHighRisk ? "text-red-600" : "text-green-600"}`}>
            {risk_level === 1 ? "Level 1" : "Level 0"}
          </p>
        </div>
        <div className={`p-4 rounded ${isHighRisk ? "bg-red-100" : "bg-green-100"}`}>
          <p className="text-xs text-gray-600 uppercase font-semibold">Recommendation</p>
          <p className={`text-xs font-semibold ${isHighRisk ? "text-red-600" : "text-green-600"}`}>
            {isHighRisk ? "⚠️ Take precautions" : "✅ Safe conditions"}
          </p>
        </div>
      </div>
    </div>
  );
}
