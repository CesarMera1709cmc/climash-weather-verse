import { format, parseISO, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  sunrise: string;
  sunset: string;
  hourlyTemp: Array<{ time: string; temp: number }>;
  hourlyHumidity: Array<{ time: string; humidity: number }>;
  hourlyWind: Array<{ time: string; speed: number }>;
  hourlyPressure: Array<{ time: string; pressure: number }>;
}

export interface ForecastData {
  date: string;
  day: string;
  condition: string;
  high: number;
  low: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
}

export const fetchWeatherData = async (lat: number, lon: number): Promise<{ weather: WeatherData; forecast: ForecastData[] }> => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&current=temperature_2m&timezone=America%2FChicago`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    // Extract current weather
    const currentTemp = data.current.temperature_2m;
    const condition = getCondition(currentTemp); // Simplified condition based on temperature

    // Mock data for fields not provided by the API
    const mockHumidity = 65; // Example value
    const mockWindSpeed = 15; // Example value
    const mockVisibility = 10; // Example value
    const mockSunrise = '06:30';
    const mockSunset = '20:45';

    // Process hourly data (24 hours)
    const hourlyTemp = data.hourly.time.slice(0, 24).map((time: string, index: number) => ({
      time: format(parseISO(time), 'HH:mm'),
      temp: data.hourly.temperature_2m[index],
    }));

    // Mock hourly data for other metrics
    const hourlyHumidity = hourlyTemp.map((item) => ({
      time: item.time,
      humidity: mockHumidity + Math.floor(Math.random() * 10 - 5), // Random variation
    }));

    const hourlyWind = hourlyTemp.map((item) => ({
      time: item.time,
      speed: mockWindSpeed + Math.floor(Math.random() * 5 - 2), // Random variation
    }));

    const hourlyPressure = hourlyTemp.map((item) => ({
      time: item.time,
      pressure: 1013 + Math.floor(Math.random() * 20 - 10), // Random variation around 1013 hPa
    }));

    // Process forecast data (next 5 days)
    const forecast: ForecastData[] = [];
    for (let i = 0; i < 5; i++) {
      const dayIndex = i * 24; // One data point per day
      const date = parseISO(data.hourly.time[dayIndex]);
      const dailyTemps = data.hourly.temperature_2m.slice(dayIndex, dayIndex + 24);
      const high = Math.max(...dailyTemps);
      const low = Math.min(...dailyTemps);
      
      forecast.push({
        date: format(date, 'dd/MM'),
        day: format(date, 'EEEE', { locale: es }),
        condition: getCondition(high),
        high,
        low,
        humidity: mockHumidity + Math.floor(Math.random() * 10 - 5),
        windSpeed: mockWindSpeed + Math.floor(Math.random() * 5 - 2),
        precipitation: Math.floor(Math.random() * 30), // Mock precipitation
      });
    }

    const weather: WeatherData = {
      temperature: currentTemp,
      feelsLike: currentTemp, // Simplified: no feels-like data in API
      condition,
      humidity: mockHumidity,
      windSpeed: mockWindSpeed,
      visibility: mockVisibility,
      sunrise: mockSunrise,
      sunset: mockSunset,
      hourlyTemp,
      hourlyHumidity,
      hourlyWind,
      hourlyPressure,
    };

    return { weather, forecast };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

// Simplified condition logic based on temperature
const getCondition = (temp: number): string => {
  if (temp >= 20) return 'soleado';
  if (temp >= 10) return 'nublado';
  return 'lluvioso';
};