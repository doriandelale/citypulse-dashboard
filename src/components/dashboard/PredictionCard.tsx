import { motion } from "framer-motion";
import { Brain, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { PredictionApiResponse } from "@/services/api";

interface PredictionCardProps {
  data: PredictionApiResponse;
}

const trendIcons: Record<string, React.ReactNode> = {
  up: <TrendingUp className="h-4 w-4 text-score-poor" />,
  down: <TrendingDown className="h-4 w-4 text-score-good" />,
  stable: <Minus className="h-4 w-4 text-score-moderate" />,
};

const PredictionCard = ({ data }: PredictionCardProps) => {
  const confidencePct = Math.round(data.confidence_score * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="dashboard-card space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Prédiction IA
        </h3>
        <Brain className="h-5 w-5 text-primary" />
      </div>

      <div className="space-y-3">
        <div className="rounded-lg bg-secondary p-4">
          <p className="text-xs text-muted-foreground">Cible de prédiction</p>
          <p className="text-sm font-semibold text-foreground">{data.prediction_target}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-secondary p-4">
            <p className="text-xs text-muted-foreground">Valeur dans 6h</p>
            <p className="text-2xl font-bold text-foreground">{data.value_in_6h}</p>
          </div>
          <div className="rounded-lg bg-secondary p-4">
            <p className="text-xs text-muted-foreground">Tendance</p>
            <div className="mt-1 flex items-center gap-2">
              {trendIcons[data.trend] || trendIcons.stable}
              <span className="text-sm font-semibold capitalize text-foreground">{data.trend}</span>
            </div>
          </div>
        </div>

        {/* Confidence bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Confiance du modèle</span>
            <span className="font-semibold text-foreground">{confidencePct}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${confidencePct}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground">
          Modèle : {data.model_info}
        </p>
      </div>
    </motion.div>
  );
};

export default PredictionCard;
