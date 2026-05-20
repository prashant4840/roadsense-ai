"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { PredictionForm } from "@/components/PredictionForm";
import { RiskDisplay } from "@/components/RiskDisplay";
import { MapViewer } from "@/components/MapViewer";
import { RiskFactors } from "@/components/RiskFactors";
import { Footer } from "@/components/Footer";
import { PredictionResponse } from "@/types";

export default function Home() {
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Prediction Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <PredictionForm onPredict={setPrediction} />
            </div>
          </div>

          {/* Right Column: Results & Analytics */}
          <div className="lg:col-span-2 space-y-8">
            {/* Welcome Message */}
            {!prediction && (
              <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-blue-600">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to RoadSense AI</h2>
                <p className="text-gray-600 mb-4">
                  This system predicts road accident risk based on weather, traffic, and road conditions.
                </p>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">20K</div>
                    <p className="text-sm text-gray-600">Training Records</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">19</div>
                    <p className="text-sm text-gray-600">Features</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">55.6%</div>
                    <p className="text-sm text-gray-600">Accuracy</p>
                  </div>
                </div>
              </div>
            )}

            {/* Prediction Result */}
            {prediction && (
              <>
                <RiskDisplay {...prediction} />

                <button
                  onClick={() => setPrediction(null)}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold transition"
                >
                  ← New Prediction
                </button>
              </>
            )}

            {/* Risk Factors Chart */}
            <RiskFactors />

            {/* Map Viewer */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">🗺️ Accident Hotspots</h3>
              <p className="text-sm text-gray-600 mb-4">
                Major accident-prone areas across India. Red = High Risk, Orange = Medium Risk.
              </p>
              <MapViewer />
            </div>

            {/* Info Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">ℹ️ How It Works</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>✓ Enter accident details in the form</li>
                <li>✓ AI model processes the data</li>
                <li>✓ Get instant risk prediction with confidence score</li>
                <li>✓ View feature importance breakdown</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
