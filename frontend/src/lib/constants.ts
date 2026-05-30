export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const ROAD_TYPES = ["highway", "rural", "urban"] as const;
export const WEATHER_CONDITIONS = ["clear", "fog", "rain"] as const;
export const TRAFFIC_DENSITIES = ["high", "low", "medium"] as const;
export const VISIBILITY_LEVELS = ["high", "low", "medium"] as const;

export const FEATURE_IMPORTANCE = {
  temperature: 31.2,
  hour: 22.7,
  casualties: 11.5,
  vehicles_involved: 10.5,
  is_weekend: 4.0,
  road_type_urban: 1.9,
  road_type_rural: 1.9,
  is_night: 1.9,
  road_type_highway: 1.8,
  traffic_density_medium: 1.8,
};

export const INDIA_CENTER: [number, number] = [22.5937, 78.9629];

export const ACCIDENT_HOTSPOTS = [
  { lat: 28.7041, lng: 77.1025, city: "Delhi", risk: "HIGH", level: 8 },
  { lat: 19.076, lng: 72.8777, city: "Mumbai", risk: "HIGH", level: 7 },
  { lat: 13.0827, lng: 80.2707, city: "Chennai", risk: "MEDIUM", level: 5 },
  { lat: 23.1815, lng: 79.9864, city: "Bhopal", risk: "MEDIUM", level: 5 },
  { lat: 26.8467, lng: 80.9462, city: "Lucknow", risk: "MEDIUM", level: 5 },
  { lat: 17.385, lng: 78.4867, city: "Hyderabad", risk: "HIGH", level: 7 },
  { lat: 22.5726, lng: 88.3639, city: "Kolkata", risk: "MEDIUM", level: 6 },
];
