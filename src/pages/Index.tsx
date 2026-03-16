import { useState } from "react";
import { Activity } from "lucide-react";
import CitySelector from "@/components/dashboard/CitySelector";
import UrbanScore from "@/components/dashboard/UrbanScore";
import WeatherCard from "@/components/dashboard/WeatherCard";
import AirQualityCard from "@/components/dashboard/AirQualityCard";
import EventsList from "@/components/dashboard/EventsList";
import PredictionCard from "@/components/dashboard/PredictionCard";
import { CardLoader, CardError } from "@/components/dashboard/CardStates";
import { useFetch } from "@/hooks/useFetch";
import { getWeather, getAirQuality, getEvents, getPrediction, getUrbanScore } from "@/services/api";

const Index = () => {
  const [selectedCity, setSelectedCity] = useState("paris");

  const score = useFetch(() => getUrbanScore(selectedCity), [selectedCity]);
  const weather = useFetch(() => getWeather(selectedCity), [selectedCity]);
  const air = useFetch(() => getAirQuality(selectedCity), [selectedCity]);
  const events = useFetch(() => getEvents(selectedCity), [selectedCity]);
  const prediction = useFetch(() => getPrediction(selectedCity), [selectedCity]);

  const cityLabel = selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1);

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
          <h1 className="text-2xl font-bold text-foreground">{cityLabel}</h1>
          <p className="text-sm text-muted-foreground">
            Tableau de bord urbain en temps réel — CityPulse
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Row 1: Score Urbain */}
          <div className="md:col-span-2">
            {score.loading ? <CardLoader /> : score.error ? <CardError message={score.error} onRetry={score.refetch} /> : score.data && <UrbanScore data={score.data} />}
          </div>

          {/* Row 2: Weather + Air Quality */}
          {weather.loading ? <CardLoader /> : weather.error ? <CardError message={weather.error} onRetry={weather.refetch} /> : weather.data && <WeatherCard data={weather.data} />}
          {air.loading ? <CardLoader /> : air.error ? <CardError message={air.error} onRetry={air.refetch} /> : air.data && <AirQualityCard data={air.data} />}

          {/* Row 3: Prediction */}
          <div className="md:col-span-2 lg:col-span-1">
            {prediction.loading ? <CardLoader /> : prediction.error ? <CardError message={prediction.error} onRetry={prediction.refetch} /> : prediction.data && <PredictionCard data={prediction.data} />}
          </div>

          {/* Row 4: Events */}
          <div className="md:col-span-2">
            {events.loading ? <CardLoader /> : events.error ? <CardError message={events.error} onRetry={events.refetch} /> : events.data && <EventsList events={events.data} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
