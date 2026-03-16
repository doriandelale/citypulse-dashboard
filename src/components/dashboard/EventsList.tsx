import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import type { EventApiResponse } from "@/services/api";

interface EventsListProps {
  events: EventApiResponse[];
}

const categoryColors: Record<string, string> = {
  "Art & Culture": "bg-primary/10 text-primary",
  "Sport": "bg-score-good/10 text-score-good",
  "Musique": "bg-score-moderate/10 text-score-moderate",
  "Exposition": "bg-destructive/10 text-destructive",
  "Marché": "bg-success/10 text-success",
  "Conférence": "bg-accent/10 text-accent",
};

const EventsList = ({ events }: EventsListProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="dashboard-card space-y-4"
    >
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Événements à venir
      </h3>

      <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
        {events.map((event, i) => (
          <motion.div
            key={`${event.title}-${i}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * i }}
            className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{event.title}</p>
              {event.description && (
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{event.description}</p>
              )}
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {event.date} — {event.time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {event.location}
                </span>
              </div>
            </div>
            <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${categoryColors[event.category] || "bg-secondary text-secondary-foreground"}`}>
              {event.category}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default EventsList;
