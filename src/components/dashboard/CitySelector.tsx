import { MapPin } from "lucide-react";
import { cities, type CityData } from "@/data/mockData";

interface CitySelectorProps {
  selectedCity: string;
  onCityChange: (cityId: string) => void;
}

const CitySelector = ({ selectedCity, onCityChange }: CitySelectorProps) => {
  const city = cities.find((c) => c.id === selectedCity);

  return (
    <div className="relative flex items-center gap-2">
      <MapPin className="h-4 w-4 text-primary" />
      <select
        value={selectedCity}
        onChange={(e) => onCityChange(e.target.value)}
        className="appearance-none rounded-lg border border-border bg-card px-3 py-1.5 pr-8 text-sm font-medium text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {cities.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}, {c.country}
          </option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-2 h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
};

export default CitySelector;
