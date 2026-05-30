"use client";


import { AccidentData, PredictionResponse } from "@/types";
import { ROAD_TYPES, WEATHER_CONDITIONS, TRAFFIC_DENSITIES, VISIBILITY_LEVELS } from "@/lib/constants";
import { usePrediction } from "@/hooks/usePrediction";
import { useFormState } from "@/hooks/useFormState";
import { useFormValidation } from "@/hooks/useFormValidation";

const DEFAULT_FORM_DATA: AccidentData = {
  hour: 14,
  is_weekend: 0,
  temperature: 25,
  vehicles_involved: 2,
  casualties: 1,
  is_peak_hour: 0,
  is_night: 0,
  road_type: "highway",
  weather: "clear",
  traffic_density: "high",
  visibility: "high",
};

export function PredictionForm({ onPredict }: { onPredict: (data: PredictionResponse) => void }) {
  const { formData, setFormData, handleChange, handleBlur, errors, setErrors, resetForm } = useFormState(
    DEFAULT_FORM_DATA
  );
  const { predict, loading, error: apiError } = usePrediction();
  const { validateForm } = useFormValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await predict(formData);
    if (result) {
      onPredict(result);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Time Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">⏰ Time & Date</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hour (0-23)</label>
            <input
              type="number"
              name="hour"
              min="0"
              max="23"
              value={formData.hour}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="14"
            />
            {errors.hour && <p className="text-red-500 text-xs mt-1">{errors.hour}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Day Type</label>
            <select
              name="is_weekend"
              value={formData.is_weekend}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={0}>Weekday</option>
              <option value={1}>Weekend</option>
            </select>
          </div>
        </div>
      </div>

      {/* Weather Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">🌦️ Weather</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
            <select
              name="weather"
              value={formData.weather}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {WEATHER_CONDITIONS.map((w) => (
                <option key={w} value={w}>
                  {w.charAt(0).toUpperCase() + w.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Temperature (°C)
            </label>
            <input
              type="number"
              name="temperature"
              min="-50"
              max="60"
              step="0.1"
              value={formData.temperature}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="25"
            />
            {errors.temperature && (
              <p className="text-red-500 text-xs mt-1">{errors.temperature}</p>
            )}
          </div>
        </div>
      </div>

      {/* Visibility Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">👁️ Visibility</h3>
        <select
          name="visibility"
          value={formData.visibility}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {VISIBILITY_LEVELS.map((v) => (
            <option key={v} value={v}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Road & Traffic Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">🛣️ Road & Traffic</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Road Type</label>
            <select
              name="road_type"
              value={formData.road_type}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {ROAD_TYPES.map((rt) => (
                <option key={rt} value={rt}>
                  {rt.charAt(0).toUpperCase() + rt.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Traffic Density</label>
            <select
              name="traffic_density"
              value={formData.traffic_density}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {TRAFFIC_DENSITIES.map((td) => (
                <option key={td} value={td}>
                  {td.charAt(0).toUpperCase() + td.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Accident Details Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">🚗 Accident Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicles Involved</label>
            <input
              type="number"
              name="vehicles_involved"
              min="1"
              value={formData.vehicles_involved}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="2"
            />
            {errors.vehicles_involved && (
              <p className="text-red-500 text-xs mt-1">{errors.vehicles_involved}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Casualties</label>
            <input
              type="number"
              name="casualties"
              min="0"
              value={formData.casualties}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="1"
            />
            {errors.casualties && (
              <p className="text-red-500 text-xs mt-1">{errors.casualties}</p>
            )}
          </div>
        </div>
      </div>

      {/* Checkboxes Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">📋 Additional Info</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_peak_hour"
              checked={formData.is_peak_hour === 1}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, is_peak_hour: e.target.checked ? 1 : 0 }))
              }
              className="w-4 h-4 rounded border-gray-300 text-blue-600"
            />
            <span className="text-sm text-gray-700">Peak Hour</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_night"
              checked={formData.is_night === 1}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, is_night: e.target.checked ? 1 : 0 }))
              }
              className="w-4 h-4 rounded border-gray-300 text-blue-600"
            />
            <span className="text-sm text-gray-700">Night Time (20:00 - 5:00)</span>
          </label>
        </div>
      </div>

      {/* Error Message */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{apiError}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "⏳ Predicting..." : "🔮 Predict Accident Risk"}
        </button>
        <button
          type="button"
          onClick={resetForm}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
