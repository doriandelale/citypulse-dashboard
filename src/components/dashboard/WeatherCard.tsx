import { motion } from "framer-motion";
import { Cloud, Droplets, Thermometer, Wind } from "lucide-react";
import type { WeatherApiResponse } from "@/services/api";

interface WeatherCardProps {
  data: WeatherApiResponse;
}

const weatherIcons: Record<string, string> = {
  "01d": "☀️", "01n": "🌙", "02d": "⛅", "02n": "☁️",
  "03d": "☁️", "03n": "☁️", "04d": "☁️", "04n": "☁️",
  "09d": "🌧️", "09n": "🌧️", "10d": "🌦️", "10n": "🌧️",
  "11d": "⛈️", "11n": "⛈️", "13d": "❄️", "13n": "❄️",
  "50d": "🌫️", "50n": "🌫️",
};

const WeatherCard = ({ data }: WeatherCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="dashboard-card space-y-5"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Météo</h3>
        <Cloud className="h-5 w-5 text-primary" />
      </div>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">{weatherIcons[data.icon] || "🌤️"}</span>
            <p className="text-5xl font-bold text-foreground">{data.temperature}°</p>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{data.description}</p>
        </div>
        <div className="space-y-2 text-right text-sm">
          <div className="flex items-center justify-end gap-1.5 text-muted-foreground">
            <Thermometer className="h-3.5 w-3.5" />
            <span>Ressenti {data.feels_like}°</span>
          </div>
          <div className="flex items-center justify-end gap-1.5 text-muted-foreground">
            <Droplets className="h-3.5 w-3.5" />
            <span>{data.humidity}%</span>
          </div>
          <div className="flex items-center justify-end gap-1.5 text-muted-foreground">
            <Wind className="h-3.5 w-3.5" />
            <span>{data.wind_speed} km/h</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherCard;
