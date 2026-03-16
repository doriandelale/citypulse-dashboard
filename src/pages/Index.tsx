import { useState } from "react";
import { Activity } from "lucide-react";
import CitySelector from "@/components/dashboard/CitySelector";
import UrbanScore from "@/components/dashboard/UrbanScore";
import WeatherCard from "@/components/dashboard/WeatherCard";
import AirQualityCard from "@/components/dashboard/AirQualityCard";
import EventsList from "@/components/dashboard/EventsList";
import PredictionCard from "@/components/dashboard/PredictionCard";
import MapSection from "@/components/dashboard/MapSection";
import {
  cities,
  mockWeather,
  mockAirQuality,
  mockEvents,
  mockPredictions,
  mockScores,
} from "@/data/mockData";

const Index = () => {
  const [selectedCity, setSelectedCity] = useState("paris");

  const city = cities.find((c) => c.id === selectedCity)!;
  const weather = mockWeather[selectedCity];
  const air = mockAirQuality[selectedCity];
  const events = mockEvents[selectedCity];
  const prediction = mockPredictions[selectedCity];
  const score = mockScores[selectedCity];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold text-foreground">
              Pulse<span className="text-primary">Board</span>
            </span>
          </div>
          <CitySelector selectedCity={selectedCity} onCityChange={setSelectedCity} />
        </div>
      </header>

      {/* Dashboard */}
      <main className="container py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">{city.name}</h1>
          <p className="text-sm text-muted-foreground">
            Tableau de bord urbain en temps réel — CityPulse
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {/* Score + Map */}
          <div className="space-y-5">
            <UrbanScore data={score} />
            <MapSection city={city} aqi={air.aqi} />
          </div>

          {/* Weather + Air */}
          <div className="space-y-5">
            <WeatherCard data={weather} />
            <AirQualityCard data={air} />
          </div>

          {/* Events + Prediction */}
          <div className="space-y-5 md:col-span-2 lg:col-span-1">
            <EventsList events={events} />
            <PredictionCard data={prediction} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
