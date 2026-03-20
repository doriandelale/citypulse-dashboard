import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Thermometer, Wind, ShieldAlert, X } from "lucide-react";
import { useState } from "react";
import type { WeatherApiResponse, AirQualityApiResponse } from "@/services/api";

interface AlertBannerProps {
  weather?: WeatherApiResponse | null;
  air?: AirQualityApiResponse | null;
}

interface Alert {
  id: string;
  icon: React.ElementType;
  message: string;
  level: "warning" | "danger";
}

const AlertBanner = ({ weather, air }: AlertBannerProps) => {
  const [dismissed, setDismissed] = useState<string[]>([]);

  const alerts: Alert[] = [];

  if (air && air.aqi >= 4) {
    alerts.push({
      id: "aqi-danger",
      icon: ShieldAlert,
      message: `Pollution élevée (AQI ${air.aqi}) — Évitez les activités extérieures prolongées`,
      level: "danger",
    });
  } else if (air && air.aqi === 3) {
    alerts.push({
      id: "aqi-warning",
      icon: ShieldAlert,
      message: "Qualité de l'air modérée — Personnes sensibles, limitez les efforts",
      level: "warning",
    });
  }

  if (weather && weather.temperature >= 35) {
    alerts.push({
      id: "heat",
      icon: Thermometer,
      message: `Canicule : ${Math.round(weather.temperature)}°C — Hydratez-vous régulièrement`,
      level: "danger",
    });
  } else if (weather && weather.temperature <= 0) {
    alerts.push({
      id: "cold",
      icon: Thermometer,
      message: `Grand froid : ${Math.round(weather.temperature)}°C — Couvrez-vous chaudement`,
      level: "warning",
    });
  }

  if (weather && weather.wind_speed >= 60) {
    alerts.push({
      id: "wind",
      icon: Wind,
      message: `Vents violents : ${Math.round(weather.wind_speed)} km/h — Soyez prudent en extérieur`,
      level: "danger",
    });
  } else if (weather && weather.wind_speed >= 40) {
    alerts.push({
      id: "wind-mod",
      icon: Wind,
      message: `Vent fort : ${Math.round(weather.wind_speed)} km/h — Attention aux objets légers`,
      level: "warning",
    });
  }

  const visible = alerts.filter((a) => !dismissed.includes(a.id));

  if (visible.length === 0) return null;

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {visible.map((alert) => {
          const Icon = alert.icon;
          const isDanger = alert.level === "danger";
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
                isDanger
                  ? "border-destructive/30 bg-destructive/10"
                  : "border-warning/30 bg-warning/10"
              }`}
            >
              <Icon
                className={`h-4 w-4 flex-shrink-0 ${isDanger ? "text-destructive animate-pulse" : "text-warning"}`}
              />
              <p className={`flex-1 text-xs font-medium ${isDanger ? "text-destructive" : "text-warning"}`}>
                {alert.message}
              </p>
              <button
                onClick={() => setDismissed((d) => [...d, alert.id])}
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default AlertBanner;
