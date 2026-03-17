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
  icon_code: string;
  forecast_24h: { time: string; temp: number }[];
}

export interface AirQualityApiResponse {
  city: string;
  aqi: number;
  status: string;
  color_code: string;
  pollutants: {
    pm25: number;
    no2: number;
    o3: number;
  };
  recommendation: string;
}

export interface EventApiResponse {
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description: string;
}

export interface PredictionApiResponse {
  prediction_target: string;
  value_in_6h: number;
  trend: string;
  confidence_score: number;
  model_info: string;
}

export interface UrbanScoreApiResponse {
  city: string;
  global_score: number;
  rating: string;
  details: {
    environment: number;
    activity: number;
    safety: number;
  };
  last_updated: string;
}

export const getWeather = (city: string) =>
  fetchJson<WeatherApiResponse>(`${API_BASE}/api/weather/${city}`);

export const getAirQuality = (city: string) =>
  fetchJson<AirQualityApiResponse>(`${API_BASE}/api/air/${city}`);

export const getEvents = (city: string) =>
  fetchJson<EventApiResponse[]>(`${API_BASE}/api/events/${city}`);

export const getPrediction = (city: string) =>
  fetchJson<PredictionApiResponse>(`${API_BASE}/api/predict/${city}`);

export const getUrbanScore = (city: string) =>
  fetchJson<UrbanScoreApiResponse>(`${API_BASE}/api/score/${city}`);
