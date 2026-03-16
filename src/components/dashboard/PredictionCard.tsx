import { Brain } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { PredictionData } from "@/data/mockData";

interface PredictionCardProps {
  data: PredictionData;
}

const PredictionCard = ({ data }: PredictionCardProps) => {
  const chartData = data.predictions.map((p) => ({
    ...p,
    fill: p.confidence >= 80 ? "hsl(152, 69%, 45%)" : p.confidence >= 60 ? "hsl(38, 92%, 50%)" : "hsl(0, 84%, 60%)",
  }));

  return (
    <div className="dashboard-card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Prédiction IA
        </h3>
        <Brain className="h-5 w-5 text-primary" />
      </div>

      <p className="text-xs text-muted-foreground">
        {data.type === "air_quality" ? "Qualité de l'air prédite" : "Température prédite"} — 6 prochaines heures
      </p>

      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" vertical={false} />
            <XAxis dataKey="hour" tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 46%)" tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 46%)" tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: "hsl(0, 0%, 100%)", border: "1px solid hsl(220, 13%, 90%)", borderRadius: "8px", fontSize: "12px" }}
              formatter={(value: number, name: string) => {
                if (name === "value") return [`AQI ${value}`, "Valeur"];
                return [`${value}%`, "Confiance"];
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="hsl(217, 91%, 60%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {data.predictions.slice(0, 3).map((p) => (
          <div key={p.hour} className="rounded-lg bg-secondary p-2 text-center">
            <p className="text-[10px] text-muted-foreground">{p.hour}</p>
            <p className="text-sm font-bold text-foreground">{p.value}</p>
            <p className="text-[10px] text-muted-foreground">±{100 - p.confidence}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredictionCard;
