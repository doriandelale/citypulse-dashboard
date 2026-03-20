import { motion } from "framer-motion";
import { Heart, TreePine, Home, Umbrella, Snowflake, Sun, AlertTriangle } from "lucide-react";
import type { WeatherApiResponse, AirQualityApiResponse } from "@/services/api";

// Use Activity instead of Running (not in lucide)
import { Activity } from "lucide-react";

interface HealthRecommendationsProps {
  weather?: WeatherApiResponse | null;
  air?: AirQualityApiResponse | null;
}

interface Recommendation {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  tag: string;
}

const HealthRecommendations = ({ weather, air }: HealthRecommendationsProps) => {
  if (!weather && !air) return null;

  const recs: Recommendation[] = [];
  const temp = weather?.temperature ?? 20;
  const aqi = air?.aqi ?? 1;
  const wind = weather?.wind_speed ?? 0;
  const icon = weather?.icon ?? "01d";
  const isRainy = icon.startsWith("09") || icon.startsWith("10") || icon.startsWith("11");
  const isCold = temp <= 5;
  const isHot = temp >= 30;

  // Outdoor activity recommendation
  if (aqi <= 2 && !isRainy && temp >= 10 && temp <= 30 && wind < 40) {
    recs.push({
      icon: Activity,
      title: "Conditions idéales pour le sport",
      description: "Profitez-en pour courir, marcher ou faire du vélo en extérieur.",
      color: "hsl(var(--success))",
      tag: "🏃 Sport",
    });
  } else if (aqi >= 4 || isRainy) {
    recs.push({
      icon: Home,
      title: "Privilégiez l'intérieur",
      description: aqi >= 4
        ? "La qualité de l'air est mauvaise. Optez pour du yoga ou de la musculation."
        : "La pluie est de mise. Parfait pour une séance en salle.",
      color: "hsl(var(--warning))",
      tag: "🏠 Indoor",
    });
  }

  // Temperature-specific
  if (isHot) {
    recs.push({
      icon: Sun,
      title: "Protégez-vous de la chaleur",
      description: "Buvez au moins 2L d'eau, évitez le soleil entre 12h et 16h, portez un chapeau.",
      color: "hsl(var(--destructive))",
      tag: "☀️ Chaleur",
    });
  } else if (isCold) {
    recs.push({
      icon: Snowflake,
      title: "Couvrez-vous bien",
      description: "Superposez les couches, protégez vos extrémités et évitez les expositions prolongées.",
      color: "hsl(var(--primary))",
      tag: "❄️ Froid",
    });
  }

  // AQI-specific health
  if (aqi >= 3) {
    recs.push({
      icon: AlertTriangle,
      title: "Personnes sensibles : prudence",
      description: "Asthmatiques, enfants et personnes âgées : réduisez les efforts en extérieur.",
      color: "hsl(var(--warning))",
      tag: "⚕️ Santé",
    });
  }

  // General wellness
  if (aqi <= 2 && !isRainy && temp >= 15 && temp <= 28) {
    recs.push({
      icon: TreePine,
      title: "Sortie nature recommandée",
      description: "Les conditions sont parfaites pour une balade en parc ou en forêt.",
      color: "hsl(var(--success))",
      tag: "🌳 Bien-être",
    });
  }

  // Rain
  if (isRainy) {
    recs.push({
      icon: Umbrella,
      title: "N'oubliez pas le parapluie",
      description: "Pluie attendue — prévoyez un imperméable ou un parapluie pour vos déplacements.",
      color: "hsl(var(--primary))",
      tag: "🌧️ Pluie",
    });
  }

  if (recs.length === 0) {
    recs.push({
      icon: Heart,
      title: "Journée agréable",
      description: "Aucune alerte particulière. Profitez de votre journée !",
      color: "hsl(var(--success))",
      tag: "✨ Bien-être",
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="dashboard-card space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Recommandations
        </h3>
        <Heart className="h-5 w-5 text-primary" />
      </div>

      <div className="space-y-3">
        {recs.slice(0, 4).map((rec, i) => {
          const Icon = rec.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="flex items-start gap-3 rounded-xl border border-border bg-secondary/30 p-3"
            >
              <div
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${rec.color}15` }}
              >
                <Icon className="h-4 w-4" style={{ color: rec.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{rec.title}</p>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-semibold text-muted-foreground">
                    {rec.tag}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{rec.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default HealthRecommendations;
