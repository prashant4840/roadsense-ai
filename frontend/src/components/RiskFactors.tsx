"use client";

import { FEATURE_IMPORTANCE } from "@/lib/constants";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function RiskFactors() {
  const data = Object.entries(FEATURE_IMPORTANCE)
    .map(([name, value]) => ({
      name: name.replace(/_/g, " ").toUpperCase(),
      importance: value,
    }))
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 6);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">📊 Top Risk Factors</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="importance" fill="#3b82f6" name="Importance %" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
