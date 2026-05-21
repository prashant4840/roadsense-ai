"use client";

import { ACCIDENT_HOTSPOTS, INDIA_CENTER } from "@/lib/constants";
import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

export function MapViewer() {
  return (
    <div className="h-96 rounded-lg overflow-hidden shadow-lg bg-gray-100">
      <MapContainer
        center={[INDIA_CENTER[0], INDIA_CENTER[1]]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {ACCIDENT_HOTSPOTS.map((spot) => (
          <CircleMarker
            key={`hotspot-${spot.city}`}
            center={[spot.lat, spot.lng]}
            radius={8}
            color={spot.risk === "HIGH" ? "#dc2626" : "#f97316"}
            fillOpacity={0.7}
          >
            <Popup>
              <div>
                <strong>{spot.city}</strong>
                <br />
                Risk: {spot.risk}
                <br />
                Level: {spot.level}/10
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
