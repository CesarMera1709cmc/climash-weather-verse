
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow
} from "lucide-react";

export const formatTemperature = (temp: number): string => {
  return `${Math.round(temp)}°C`;
};

export const getWeatherIcon = (condition: string) => {
  const lowerCondition = condition.toLowerCase();
  
  if (lowerCondition.includes('soleado') || lowerCondition.includes('despejado')) {
    return Sun;
  } else if (lowerCondition.includes('lluv') || lowerCondition.includes('tormenta')) {
    return CloudRain;
  } else if (lowerCondition.includes('nieve') || lowerCondition.includes('nevada')) {
    return CloudSnow;
  } else if (lowerCondition.includes('nublado') || lowerCondition.includes('nube')) {
    return Cloud;
  } else {
    return Sun; // Default icon
  }
};

export const getTemperatureColor = (temp: number): string => {
  if (temp >= 30) return "text-red-500";
  if (temp >= 25) return "text-orange-500";
  if (temp >= 20) return "text-yellow-500";
  if (temp >= 15) return "text-green-500";
  if (temp >= 10) return "text-blue-500";
  return "text-cyan-500";
};

export const getHumidityLevel = (humidity: number): string => {
  if (humidity >= 80) return "Muy Alta";
  if (humidity >= 60) return "Alta";
  if (humidity >= 40) return "Moderada";
  if (humidity >= 20) return "Baja";
  return "Muy Baja";
};

export const getWindLevel = (windSpeed: number): string => {
  if (windSpeed >= 50) return "Muy Fuerte";
  if (windSpeed >= 30) return "Fuerte";
  if (windSpeed >= 15) return "Moderado";
  if (windSpeed >= 5) return "Suave";
  return "Calma";
};

export const getUVLevel = (uvIndex: number): { level: string; color: string } => {
  if (uvIndex >= 11) return { level: "Extremo", color: "text-purple-600" };
  if (uvIndex >= 8) return { level: "Muy Alto", color: "text-red-600" };
  if (uvIndex >= 6) return { level: "Alto", color: "text-orange-600" };
  if (uvIndex >= 3) return { level: "Moderado", color: "text-yellow-600" };
  return { level: "Bajo", color: "text-green-600" };
};

// Función para interpretar condiciones meteorológicas basadas en datos de Open-Meteo
export const getWeatherCondition = (
  precipitation: number,
  isDay: boolean,
  radiation: number
): string => {
  if (precipitation > 50) return "lluvioso";
  if (precipitation > 20) return "parcialmente nublado";
  if (radiation > 400 && isDay) return "soleado";
  if (radiation < 100) return "nublado";
  return isDay ? "despejado" : "despejado nocturno";
};

// Función para calcular humedad relativa aproximada usando punto de rocío
export const calculateHumidity = (temp: number, dewPoint: number): number => {
  const humidity = 100 * Math.exp((17.625 * dewPoint) / (243.04 + dewPoint)) / 
                   Math.exp((17.625 * temp) / (243.04 + temp));
  return Math.min(100, Math.max(0, Math.round(humidity)));
};
