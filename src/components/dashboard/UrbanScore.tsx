import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { useState } from "react";
import type { UrbanScoreData } from "@/data/mockData";

interface UrbanScoreProps {
  data: UrbanScoreData;
}

const getScoreColor = (score: number) => {
  if (score >= 70) return "text-score-good";
  if (score >= 40) return "text-score-moderate";
  return "text-score-poor";
};

const getScoreBg = (score: number) => {
  if (score >= 70) return "bg-score-good";
  if (score >= 40) return "bg-score-moderate";
  return "bg-score-poor";
};

const getScoreRing = (score: number) => {
  if (score >= 70) return "hsl(152, 69%, 45%)";
  if (score >= 40) return "hsl(38, 92%, 50%)";
  return "hsl(0, 84%, 60%)";
};

const getScoreLabel = (score: number) => {
  if (score >= 70) return "Bon";
  if (score >= 40) return "Modéré";
  return "Mauvais";
};

const UrbanScore = ({ data }: UrbanScoreProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (data.score / 100) * circumference;

  return (
    <div className="dashboard-card relative flex flex-col items-center gap-4">
      <div className="flex w-full items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Score Urbain
        </h3>
        <button
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setShowTooltip(!showTooltip)}
          className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Info className="h-4 w-4" />
        </button>
      </div>

      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-4 top-12 z-10 w-56 rounded-lg border border-border bg-popover p-3 shadow-lg"
        >
          <p className="mb-2 text-xs font-semibold text-popover-foreground">Critères du score :</p>
          <div className="space-y-1.5">
            {[
              { label: "Météo", value: data.criteria.weather },
              { label: "Qualité de l'air", value: data.criteria.airQuality },
              { label: "Événements", value: data.criteria.events },
            ].map((c) => (
              <div key={c.label} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{c.label}</span>
                <span className={`font-semibold ${getScoreColor(c.value)}`}>{c.value}/100</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="relative flex items-center justify-center">
        <svg width="140" height="140" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
          <motion.circle
            cx="60" cy="60" r="54" fill="none"
            stroke={getScoreRing(data.score)}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <motion.span
            className={`text-4xl font-bold ${getScoreColor(data.score)}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {data.score}
          </motion.span>
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
      </div>

      <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${getScoreBg(data.score)} text-primary-foreground`}>
        <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-primary-foreground" />
        {getScoreLabel(data.score)}
      </div>
    </div>
  );
};

export default UrbanScore;
