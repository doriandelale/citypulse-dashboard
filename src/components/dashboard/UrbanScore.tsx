import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { useState } from "react";
import type { UrbanScoreApiResponse } from "@/services/api";

interface UrbanScoreProps {
  data: UrbanScoreApiResponse;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-score-good";
  if (score >= 50) return "text-score-moderate";
  return "text-score-poor";
};

const getScoreBg = (score: number) => {
  if (score >= 80) return "bg-score-good";
  if (score >= 50) return "bg-score-moderate";
  return "bg-score-poor";
};

const getScoreRing = (score: number) => {
  if (score >= 80) return "hsl(152, 69%, 45%)";
  if (score >= 50) return "hsl(38, 92%, 50%)";
  return "hsl(0, 84%, 60%)";
};

const getScoreLabel = (score: number) => {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Bon";
  if (score >= 50) return "Correct";
  return "Mauvais";
};

const UrbanScore = ({ data }: UrbanScoreProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const score = Math.round(data.score);
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="dashboard-card relative flex flex-col items-center gap-4"
    >
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
          <p className="mb-2 text-xs font-semibold text-popover-foreground">Détails du score :</p>
          <div className="space-y-1.5">
            {[
              { label: `Météo (${data.ponderation.weather})`, value: data.details.weather_score },
              { label: `Air (${data.ponderation.air})`, value: data.details.air_score },
              { label: `Événements (${data.ponderation.events})`, value: data.details.events_score },
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
            stroke={getScoreRing(score)}
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
            className={`text-4xl font-bold ${getScoreColor(score)}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
      </div>

      <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${getScoreBg(score)} text-primary-foreground`}>
        <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-primary-foreground" />
        {getScoreLabel(score)}
      </div>
    </motion.div>
  );
};

export default UrbanScore;
