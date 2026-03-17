import { useState } from "react";
import { Activity } from "lucide-react";
import CitySelector from "@/components/dashboard/CitySelector";
import UrbanScore from "@/components/dashboard/UrbanScore";
import WeatherCard from "@/components/dashboard/WeatherCard";
import AirQualityCard from "@/components/dashboard/AirQualityCard";
import EventsList from "@/components/dashboard/EventsList";
import { CardLoader, CardError } from "@/components/dashboard/CardStates";
import { useFetch } from "@/hooks/useFetch";
import { getWeather, getForecast, getAirQuality, getEvents, getUrbanScore } from "@/services/api";

const Index = () => {
  const [selectedCity, setSelectedCity] = useState("Paris");

  const score = useFetch(() => getUrbanScore(selectedCity), [selectedCity]);
  const weather = useFetch(() => getWeather(selectedCity), [selectedCity]);
  const forecast = useFetch(() => getForecast(selectedCity), [selectedCity]);
  const air = useFetch(() => getAirQuality(selectedCity), [selectedCity]);
  const events = useFetch(() => getEvents(selectedCity), [selectedCity]);

  return (
    <div className="min-h-screen bg-background">
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

      <main className="container py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">{selectedCity}</h1>
          <p className="text-sm text-muted-foreground">
            Tableau de bord urbain en temps réel — CityPulse
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Score Urbain */}
          <div className="md:col-span-2">
            {score.loading ? <CardLoader /> : score.error ? <CardError message={score.error} onRetry={score.refetch} /> : score.data && <UrbanScore data={score.data} />}
          </div>

          {/* Weather + Air */}
          {weather.loading ? <CardLoader /> : weather.error ? <CardError message={weather.error} onRetry={weather.refetch} /> : weather.data && <WeatherCard data={weather.data} forecast={forecast.data} />}
          {air.loading ? <CardLoader /> : air.error ? <CardError message={air.error} onRetry={air.refetch} /> : air.data && <AirQualityCard data={air.data} />}

          {/* Events */}
          <div className="md:col-span-2">
            {events.loading ? <CardLoader /> : events.error ? <CardError message={events.error} onRetry={events.refetch} /> : events.data && <EventsList data={events.data} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
