import { useEffect, useRef } from "react";
import L from "leaflet";
import type { CityData } from "@/data/mockData";

interface MapSectionProps {
  city: CityData;
  aqi: number;
}

const MapSection = ({ city, aqi }: MapSectionProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView(city.coordinates, 12);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    const markerColor = aqi <= 50 ? "#22c55e" : aqi <= 100 ? "#f59e0b" : "#ef4444";
    const icon = L.divIcon({
      className: "custom-marker",
      html: `<div style="width:20px;height:20px;border-radius:50%;background:${markerColor};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    L.marker(city.coordinates, { icon }).addTo(map)
      .bindPopup(`<strong>${city.name}</strong><br/>AQI: ${aqi}`);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [city, aqi]);

  return (
    <div className="dashboard-card overflow-hidden p-0">
      <div className="p-4 pb-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Carte</h3>
      </div>
      <div ref={mapRef} className="h-64 w-full md:h-80" />
    </div>
  );
};

export default MapSection;
