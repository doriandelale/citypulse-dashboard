import { motion } from "framer-motion";
import { Calendar, MapPin, ExternalLink } from "lucide-react";
import type { EventsApiResponse } from "@/services/api";

interface EventsListProps {
  data: EventsApiResponse;
}

const EventsList = ({ data }: EventsListProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="dashboard-card space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Événements à venir
        </h3>
        <span className="text-xs text-muted-foreground">{data.count} événement{data.count !== 1 ? "s" : ""}</span>
      </div>

      {data.events.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Aucun événement à venir pour {data.city}</p>
      ) : (
        <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
          {data.events.map((event, i) => (
            <motion.div
              key={`${event.title}-${i}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
            >
              {event.image && (
                <img src={event.image} alt={event.title} className="h-14 w-14 flex-shrink-0 rounded-lg object-cover" />
              )}
              {!event.image && (
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{event.title}</p>
                {event.description && (
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{event.description}</p>
                )}
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {event.date_start}
                  </span>
                  {event.location_name && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.location_name}
                    </span>
                  )}
                </div>
              </div>
              {event.link && (
                <a href={event.link} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 text-muted-foreground hover:text-primary">
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default EventsList;
