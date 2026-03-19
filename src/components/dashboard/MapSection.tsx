import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { Maximize2, Minimize2, Layers } from "lucide-react";
import type { EventItem } from "@/services/api";

import "leaflet/dist/leaflet.css";

interface MapSectionProps {
  city: string;
  aqi: number;
  events?: EventItem[];
}

const cityCoords: Record<string, [number, number]> = {
  Paris: [48.8566, 2.3522],
  Lyon: [45.764, 4.8357],
  Marseille: [43.2965, 5.3698],
  Toulouse: [43.6047, 1.4442],
  Nice: [43.7102, 7.262],
  Bordeaux: [44.8378, -0.5792],
  Rennes: [48.1173, -1.6778],
  Nantes: [47.2184, -1.5536],
  Strasbourg: [48.5734, 7.7521],
  Lille: [50.6292, 3.0573],
  Monaco: [43.7384, 7.4246],
};

const categoryIcons: Record<string, { emoji: string; color: string; label: string }> = {
  concert: { emoji: "🎵", color: "#f59e0b", label: "Concerts" },
  spectacle: { emoji: "🎭", color: "#ef4444", label: "Spectacles" },
  exposition: { emoji: "🎨", color: "#8b5cf6", label: "Expositions" },
  conférence: { emoji: "🎤", color: "#3b82f6", label: "Conférences" },
  visite: { emoji: "🏛️", color: "#22c55e", label: "Visites" },
  "événement": { emoji: "⭐", color: "#ec4899", label: "Événements" },
};

const getCategoryIcon = (cat: string) => {
  const key = cat.toLowerCase().replace(/^:/, "");
  return categoryIcons[key] || { emoji: "📍", color: "#6b7280", label: "Autre" };
};

const aqiLabels: Record<number, { label: string; color: string }> = {
  1: { label: "Excellent", color: "#22c55e" },
  2: { label: "Bon", color: "#84cc16" },
  3: { label: "Modéré", color: "#f59e0b" },
  4: { label: "Mauvais", color: "#ef4444" },
  5: { label: "Très mauvais", color: "#dc2626" },
};

const MapSection = ({ city, aqi, events }: MapSectionProps) => {
  const safeEvents = events ?? [];
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLegend, setShowLegend] = useState(false);

  const coords = cityCoords[city] || [48.8566, 2.3522];

  // Compute active categories from events
  const activeCategories = [...new Set(safeEvents.map(e => (e.category || "").toLowerCase().replace(/^:/, "")))];

  useEffect(() => {
    if (!mapRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView(coords, 13);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Fetch real city boundary from Nominatim (OSM)
    const fetchBoundary = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)},France&format=json&polygon_geojson=1&limit=1`,
          { headers: { "User-Agent": "PulseBoard/1.0" } }
        );
        const data = await res.json();
        if (data?.[0]?.geojson) {
          L.geoJSON(data[0].geojson, {
            style: {
              color: "#22c55e",
              weight: 2,
              opacity: 0.5,
              fillColor: "#22c55e",
              fillOpacity: 0.12,
            },
          }).addTo(map);
        }
      } catch {
        L.circle(coords, {
          radius: 3000,
          color: "#22c55e",
          weight: 2,
          opacity: 0.4,
          fillColor: "#22c55e",
          fillOpacity: 0.12,
        }).addTo(map);
      }
    };
    fetchBoundary();

    // City center marker with animated pulse
    const markerColor = aqi <= 2 ? "#22c55e" : aqi <= 3 ? "#f59e0b" : "#ef4444";
    const aqiInfo = aqiLabels[aqi] || aqiLabels[1];
    const cityIcon = L.divIcon({
      className: "custom-marker",
      html: `
        <div style="position:relative;width:44px;height:44px;display:flex;align-items:center;justify-content:center;">
          <div style="
            position:absolute;inset:0;border-radius:50%;
            background:${markerColor};opacity:0.25;
            animation:pulse-ring 2s ease-out infinite;
          "></div>
          <div style="
            position:absolute;inset:6px;border-radius:50%;
            background:${markerColor};opacity:0.15;
            animation:pulse-ring 2s ease-out 0.5s infinite;
          "></div>
          <div style="
            position:relative;width:22px;height:22px;border-radius:50%;
            background:${markerColor};border:3px solid white;
            box-shadow:0 2px 10px rgba(0,0,0,0.3);
            display:flex;align-items:center;justify-content:center;
            font-size:9px;font-weight:bold;color:white;
          ">${aqi}</div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

    L.marker(coords, { icon: cityIcon })
      .addTo(map)
      .bindPopup(
        `<div style="text-align:center;min-width:120px;">
          <strong style="font-size:13px;">${city}</strong>
          <div style="margin-top:4px;padding:3px 8px;border-radius:12px;background:${aqiInfo.color}22;color:${aqiInfo.color};font-size:11px;font-weight:600;">
            AQI ${aqi} — ${aqiInfo.label}
          </div>
        </div>`,
        { closeButton: false }
      );

    // Event markers with Google Maps itinerary link in popup
    if (safeEvents.length > 0) {
      const eventGroup = L.layerGroup().addTo(map);

      safeEvents.forEach((event, i) => {
        const angle = (2 * Math.PI * i) / Math.max(safeEvents.length, 1);
        const radius = 0.008 + Math.random() * 0.012;
        const lat = coords[0] + Math.cos(angle) * radius;
        const lng = coords[1] + Math.sin(angle) * radius;

        const { emoji, color } = getCategoryIcon(event.category || "");

        const eventIcon = L.divIcon({
          className: "event-marker",
          html: `<div style="
            display:flex;align-items:center;justify-content:center;
            width:32px;height:32px;border-radius:50%;
            background:${color};border:2px solid white;
            box-shadow:0 2px 8px rgba(0,0,0,0.25);
            font-size:14px;cursor:pointer;
            transition:transform 0.2s;
          " onmouseover="this.style.transform='scale(1.3)'" onmouseout="this.style.transform='scale(1)'">${emoji}</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const linkHtml = (event.url || event.link)
          ? `<a href="${event.url || event.link}" target="_blank" rel="noopener" style="color:#3b82f6;font-size:11px;text-decoration:none;">Voir plus →</a>`
          : "";

        const locationStr = event.location_address || event.location || event.location_name || "";
        const mapsHtml = locationStr
          ? `<a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(locationStr)}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:3px;margin-top:4px;padding:2px 8px;border-radius:10px;background:#3b82f620;color:#3b82f6;font-size:10px;font-weight:600;text-decoration:none;">🧭 Itinéraire</a>`
          : "";

        const dateStr = event.date || event.date_start || "";
        const dateHtml = dateStr
          ? `<span style="font-size:10px;color:#888;">${new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span>`
          : "";

        L.marker([lat, lng], { icon: eventIcon })
          .addTo(eventGroup)
          .bindPopup(
            `<div style="min-width:160px;line-height:1.5;">
              <strong style="font-size:12px;">${event.title}</strong>
              ${dateHtml ? `<br/>${dateHtml}` : ""}
              ${locationStr ? `<br/><span style="font-size:10px;color:#666;">📍 ${locationStr}</span>` : ""}
              <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">
                ${linkHtml}
                ${mapsHtml}
              </div>
            </div>`,
            { closeButton: false, className: "event-popup" }
          );
      });
    }

    mapInstanceRef.current = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 300);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [city, aqi, safeEvents]);

  // Resize map when fullscreen toggles
  useEffect(() => {
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 350);
  }, [isFullscreen]);

  return (
    <div className={`dashboard-card overflow-hidden p-0 transition-all duration-300 ${isFullscreen ? "fixed inset-4 z-[9999] rounded-2xl shadow-2xl" : "relative"}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Carte — {city}
        </h3>
        <div className="flex items-center gap-2">
          {safeEvents.length > 0 && (
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
              {safeEvents.length} événement{safeEvents.length !== 1 ? "s" : ""}
            </span>
          )}
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            title="Légende"
          >
            <Layers className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            title={isFullscreen ? "Réduire" : "Plein écran"}
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Legend overlay */}
      {showLegend && (
        <div className="absolute left-3 top-14 z-[1000] rounded-xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur-sm">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Légende</p>
          {/* AQI */}
          <div className="mb-2 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ background: aqiLabels[aqi]?.color || "#22c55e" }} />
            <span className="text-[11px] text-foreground">AQI {aqi} — {aqiLabels[aqi]?.label || "N/A"}</span>
          </div>
          <div className="mb-1 h-px bg-border" />
          {/* Event categories */}
          {activeCategories.length > 0 ? (
            activeCategories.map(cat => {
              const info = categoryIcons[cat] || { emoji: "📍", color: "#6b7280", label: cat };
              return (
                <div key={cat} className="flex items-center gap-2 py-0.5">
                  <div className="flex h-4 w-4 items-center justify-content-center rounded-full text-[10px]" style={{ background: info.color }}>
                    <span className="mx-auto text-[8px]">{info.emoji}</span>
                  </div>
                  <span className="text-[11px] text-foreground">{info.label}</span>
                </div>
              );
            })
          ) : (
            <span className="text-[10px] text-muted-foreground">Aucun événement</span>
          )}
        </div>
      )}

      {/* Map */}
      <div ref={mapRef} className={`w-full leaflet-container-fix transition-all duration-300 ${isFullscreen ? "h-[calc(100%-48px)]" : "h-64 md:h-80"}`} />

      {/* Pulse animation keyframes */}
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.5); opacity: 0.4; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default MapSection;
