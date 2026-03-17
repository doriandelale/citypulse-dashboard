const API_BASE = "https://citypulse-pulseboard.onrender.com";

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export interface WeatherApiResponse {
  city: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  description: string;
  icon: string;
  icon_url: string;
}

export interface ForecastEntry {
  time: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  description: string;
  icon: string;
  icon_url: string;
}

export interface ForecastApiResponse {
  city: string;
  forecasts: ForecastEntry[];
}

export interface AirQualityApiResponse {
  city: string;
  aqi: number;
  label: string;
  color: string;
  advice: string;
  pm25: number;
  no2: number;
  o3: number;
  co: number;
}

export interface EventItem {
  title: string;
  description: string;
  date_start: string;
  date_end: string;
  location_name: string;
  location_address: string;
  category: string;
  image: string | null;
  link: string;
}

export interface EventsApiResponse {
  city: string;
  count: number;
  source: string;
  agenda_uid: string;
  events: EventItem[];
}

export interface ScoreDetails {
  weather_score: number;
  air_score: number;
  events_score: number;
}

export interface ScorePonderation {
  weather: string;
  air: string;
  events: string;
}

export interface UrbanScoreApiResponse {
  city: string;
  score: number;
  details: ScoreDetails;
  ponderation: ScorePonderation;
}

export const getWeather = (city: string) =>
  fetchJson<WeatherApiResponse>(`${API_BASE}/api/weather/${city}`);

export const getForecast = (city: string) =>
  fetchJson<ForecastApiResponse>(`${API_BASE}/api/forecast/${city}`);

export const getAirQuality = (city: string) =>
  fetchJson<AirQualityApiResponse>(`${API_BASE}/api/air/${city}`);

export const getEvents = (city: string) =>
  fetchJson<EventsApiResponse>(`${API_BASE}/api/events/${city}`);

export const getUrbanScore = (city: string) =>
  fetchJson<UrbanScoreApiResponse>(`${API_BASE}/api/score/${city}`);
