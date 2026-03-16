import { Wind } from "lucide-react";
import type { AirQualityData } from "@/data/mockData";

interface AirQualityCardProps {
  data: AirQualityData;
}

const levelConfig = {
  good: { label: "Bon", color: "bg-score-good", text: "text-score-good" },
  moderate: { label: "Modéré", color: "bg-score-moderate", text: "text-score-moderate" },
  unhealthy: { label: "Mauvais", color: "bg-score-poor", text: "text-score-poor" },
  hazardous: { label: "Dangereux", color: "bg-score-poor", text: "text-score-poor" },
};

const AirQualityCard = ({ data }: AirQualityCardProps) => {
  const config = levelConfig[data.level];
  const gaugeWidth = Math.min((data.aqi / 300) * 100, 100);

  return (
    <div className="dashboard-card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Qualité de l'air</h3>
        <Wind className="h-5 w-5 text-primary" />
      </div>

      <div className="flex items-end gap-3">
        <span className={`text-4xl font-bold ${config.text}`}>{data.aqi}</span>
        <span className={`mb-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-primary-foreground ${config.color}`}>
          {config.label}
        </span>
      </div>

      {/* Gauge */}
      <div className="space-y-1">
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className={`h-full rounded-full transition-all duration-700 ${config.color}`}
            style={{ width: `${gaugeWidth}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>0</span><span>50</span><span>100</span><span>150</span><span>200</span><span>300</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-secondary p-3">
          <p className="text-xs text-muted-foreground">PM2.5</p>
          <p className="text-lg font-bold text-foreground">{data.pm25} <span className="text-xs font-normal text-muted-foreground">µg/m³</span></p>
        </div>
        <div className="rounded-lg bg-secondary p-3">
          <p className="text-xs text-muted-foreground">NO₂</p>
          <p className="text-lg font-bold text-foreground">{data.no2} <span className="text-xs font-normal text-muted-foreground">µg/m³</span></p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-muted p-3">
        <p className="text-xs leading-relaxed text-muted-foreground">
          💡 {data.recommendation}
        </p>
      </div>
    </div>
  );
};

export default AirQualityCard;
