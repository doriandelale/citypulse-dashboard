import { Calendar, MapPin, Tag } from "lucide-react";
import type { EventData } from "@/data/mockData";

interface EventsListProps {
  events: EventData[];
}

const categoryColors: Record<string, string> = {
  "Art & Culture": "bg-primary/10 text-primary",
  "Sport": "bg-score-good/10 text-score-good",
  "Musique": "bg-score-moderate/10 text-score-moderate",
  "Exposition": "bg-destructive/10 text-destructive",
  "Marché": "bg-success/10 text-success",
};

const EventsList = ({ events }: EventsListProps) => {
  return (
    <div className="dashboard-card space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Événements à venir
      </h3>

      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{event.name}</p>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(event.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsList;
