import { MapPin, Plus, X } from "lucide-react";
import { useState } from "react";

const defaultCities = [
  { id: "Paris", name: "Paris" },
  { id: "Lyon", name: "Lyon" },
  { id: "Marseille", name: "Marseille" },
  { id: "Toulouse", name: "Toulouse" },
  { id: "Nice", name: "Nice" },
  { id: "Bordeaux", name: "Bordeaux" },
];

interface CitySelectorProps {
  selectedCity: string;
  onCityChange: (cityId: string) => void;
}

const CitySelector = ({ selectedCity, onCityChange }: CitySelectorProps) => {
  const [customCity, setCustomCity] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleAddCity = () => {
    const trimmed = customCity.trim();
    if (trimmed) {
      const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
      onCityChange(capitalized);
      setCustomCity("");
      setShowInput(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <MapPin className="h-4 w-4 text-primary" />
      <div className="relative">
        <select
          value={selectedCity}
          onChange={(e) => {
            if (e.target.value === "__custom__") {
              setShowInput(true);
            } else {
              onCityChange(e.target.value);
            }
          }}
          className="appearance-none rounded-lg border border-border bg-card px-3 py-1.5 pr-8 text-sm font-medium text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {defaultCities.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
          {!defaultCities.find((c) => c.id === selectedCity) && (
            <option value={selectedCity}>{selectedCity}</option>
          )}
          <option value="__custom__">+ Autre ville…</option>
        </select>
        <svg className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {showInput && (
        <div className="flex items-center gap-1">
          <input
            autoFocus
            value={customCity}
            onChange={(e) => setCustomCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddCity()}
            placeholder="Nom de la ville"
            className="w-32 rounded-lg border border-border bg-card px-2 py-1.5 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button onClick={handleAddCity} className="rounded-lg bg-primary p-1.5 text-primary-foreground hover:bg-primary/90">
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setShowInput(false)} className="rounded-lg bg-secondary p-1.5 text-secondary-foreground hover:bg-secondary/80">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CitySelector;
