import { motion } from "framer-motion";
import { MapPin, Users, Building2, Clock, Landmark, TrendingUp } from "lucide-react";

interface CityData {
  population: string;
  area: string;
  density: string;
  region: string;
  timezone: string;
  elevation: string;
}

const cityDatabase: Record<string, CityData> = {
  Paris: { population: "2 161 000", area: "105 km²", density: "20 580/km²", region: "Île-de-France", timezone: "UTC+1", elevation: "35 m" },
  Lyon: { population: "522 969", area: "48 km²", density: "10 900/km²", region: "Auvergne-Rhône-Alpes", timezone: "UTC+1", elevation: "175 m" },
  Marseille: { population: "873 076", area: "241 km²", density: "3 620/km²", region: "Provence-Alpes-Côte d'Azur", timezone: "UTC+1", elevation: "12 m" },
  Toulouse: { population: "504 078", area: "118 km²", density: "4 270/km²", region: "Occitanie", timezone: "UTC+1", elevation: "150 m" },
  Nice: { population: "342 669", area: "72 km²", density: "4 760/km²", region: "Provence-Alpes-Côte d'Azur", timezone: "UTC+1", elevation: "10 m" },
  Bordeaux: { population: "260 958", area: "50 km²", density: "5 220/km²", region: "Nouvelle-Aquitaine", timezone: "UTC+1", elevation: "6 m" },
  Rennes: { population: "222 485", area: "50 km²", density: "4 450/km²", region: "Bretagne", timezone: "UTC+1", elevation: "40 m" },
  Nantes: { population: "323 204", area: "65 km²", density: "4 970/km²", region: "Pays de la Loire", timezone: "UTC+1", elevation: "8 m" },
  Strasbourg: { population: "290 576", area: "78 km²", density: "3 720/km²", region: "Grand Est", timezone: "UTC+1", elevation: "140 m" },
  Lille: { population: "236 234", area: "35 km²", density: "6 750/km²", region: "Hauts-de-France", timezone: "UTC+1", elevation: "22 m" },
  Monaco: { population: "39 150", area: "2 km²", density: "19 575/km²", region: "Principauté", timezone: "UTC+1", elevation: "62 m" },
};

interface CityInsightsProps {
  city: string;
}

const CityInsights = ({ city }: CityInsightsProps) => {
  const data = cityDatabase[city];
  if (!data) return null;

  const stats = [
    { icon: Users, label: "Population", value: data.population },
    { icon: MapPin, label: "Superficie", value: data.area },
    { icon: TrendingUp, label: "Densité", value: data.density },
    { icon: Landmark, label: "Région", value: data.region },
    { icon: Building2, label: "Altitude", value: data.elevation },
    { icon: Clock, label: "Fuseau", value: data.timezone },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="dashboard-card space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Fiche ville
        </h3>
        <Building2 className="h-5 w-5 text-primary" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * i }}
              className="rounded-xl border border-border bg-secondary/30 p-3"
            >
              <div className="mb-1.5 flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </span>
              </div>
              <p className="text-sm font-bold text-foreground">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CityInsights;
