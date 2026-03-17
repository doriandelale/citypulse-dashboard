import { motion } from "framer-motion";
import { Wind } from "lucide-react";
import type { AirQualityApiResponse } from "@/services/api";

interface AirQualityCardProps {
  data: AirQualityApiResponse;
}

const colorMap: Record<string, string> = {
  green: "#22c55e",
  yellow: "#eab308",
  orange: "#f97316",
  red: "#ef4444",
  purple: "#a855f7",
  maroon: "#7f1d1d",
};

const AirQualityCard = ({ data }: AirQualityCardProps) => {
  const displayColor = colorMap[data.color] || data.color || "hsl(var(--primary))";
  const gaugeWidth = Math.min((data.aqi / 5) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="dashboard-card space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Qualité de l'air</h3>
        <Wind className="h-5 w-5 text-primary" />
      </div>

      <div className="flex items-end gap-3">
        <span className="text-4xl font-bold" style={{ color: displayColor }}>{data.aqi}</span>
        <span
          className="mb-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-primary-foreground"
          style={{ backgroundColor: displayColor }}
        >
          {data.label}
        </span>
      </div>

      {/* Gauge */}
      <div className="space-y-1">
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: displayColor }}
            initial={{ width: 0 }}
            animate={{ width: `${gaugeWidth}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "PM2.5", value: data.pm25, unit: "µg/m³" },
          { label: "NO₂", value: data.no2, unit: "µg/m³" },
          { label: "O₃", value: data.o3, unit: "µg/m³" },
        ].map((p) => (
          <div key={p.label} className="rounded-lg bg-secondary p-3">
            <p className="text-xs text-muted-foreground">{p.label}</p>
            <p className="text-lg font-bold text-foreground">{p.value} <span className="text-xs font-normal text-muted-foreground">{p.unit}</span></p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-muted p-3">
        <p className="text-xs leading-relaxed text-muted-foreground">💡 {data.advice}</p>
      </div>
    </motion.div>
  );
};

export default AirQualityCard;
