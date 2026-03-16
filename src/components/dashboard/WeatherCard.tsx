import { Cloud, Droplets, Thermometer, Wind } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { WeatherData } from "@/data/mockData";

interface WeatherCardProps {
  data: WeatherData;
}

const WeatherCard = ({ data }: WeatherCardProps) => {
  return (
    <div className="dashboard-card space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Météo</h3>
        <Cloud className="h-5 w-5 text-primary" />
      </div>

      <div className="flex items-start justify-between">
        <div>
          <p className="text-5xl font-bold text-foreground">{data.temperature}°</p>
          <p className="mt-1 text-sm text-muted-foreground">{data.condition}</p>
        </div>
        <div className="space-y-2 text-right text-sm">
          <div className="flex items-center justify-end gap-1.5 text-muted-foreground">
            <Thermometer className="h-3.5 w-3.5" />
            <span>Ressenti {data.feelsLike}°</span>
          </div>
          <div className="flex items-center justify-end gap-1.5 text-muted-foreground">
            <Droplets className="h-3.5 w-3.5" />
            <span>{data.humidity}%</span>
          </div>
          <div className="flex items-center justify-end gap-1.5 text-muted-foreground">
            <Wind className="h-3.5 w-3.5" />
            <span>{data.windSpeed} km/h {data.windDirection}</span>
          </div>
        </div>
      </div>

      <div className="h-40">
        <p className="mb-2 text-xs font-medium text-muted-foreground">Température sur 24h</p>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.hourlyForecast}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" vertical={false} />
            <XAxis dataKey="hour" tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 46%)" tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 46%)" tickLine={false} axisLine={false} domain={['auto', 'auto']} unit="°" />
            <Tooltip
              contentStyle={{ backgroundColor: "hsl(0, 0%, 100%)", border: "1px solid hsl(220, 13%, 90%)", borderRadius: "8px", fontSize: "12px" }}
              formatter={(value: number) => [`${value}°C`, "Température"]}
            />
            <Area type="monotone" dataKey="temp" stroke="hsl(217, 91%, 60%)" strokeWidth={2} fill="url(#tempGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeatherCard;
