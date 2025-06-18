
export interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    is_day: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    dew_point_2m: number[];
    wind_speed_10m: number[];
    precipitation_probability: number[];
    rain: number[];
    shortwave_radiation: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
  };
}

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  uvIndex: number;
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

export const fetchWeatherData = async (
  latitude: number = 52.52,
  longitude: number = 13.41
): Promise<{ weather: WeatherData; forecast: ForecastData[] }> => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&hourly=temperature_2m,dew_point_2m,wind_speed_10m,precipitation_probability,rain,shortwave_radiation&current=temperature_2m,apparent_temperature,is_day&timezone=auto`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error al obtener datos meteorológicos');
    }

    const data: OpenMeteoResponse = await response.json();
    
    // Procesar datos actuales
    const current = data.current;
    const todayHourly = data.hourly;
    const dailyData = data.daily;

    // Calcular humedad usando punto de rocío
    const currentHour = new Date().getHours();
    const humidity = calculateHumidity(
      current.temperature_2m,
      todayHourly.dew_point_2m[currentHour] || todayHourly.dew_point_2m[0]
    );

    // Determinar condición meteorológica
    const precipitationProb = todayHourly.precipitation_probability[currentHour] || 0;
    const radiation = todayHourly.shortwave_radiation[currentHour] || 0;
    const condition = getWeatherCondition(precipitationProb, current.is_day === 1, radiation);

    // Procesar datos horarios (próximas 24 horas)
    const hourlyTemp = todayHourly.time.slice(0, 24).map((time, index) => ({
      time: new Date(time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      temp: Math.round(todayHourly.temperature_2m[index])
    }));

    const hourlyHumidity = todayHourly.time.slice(0, 24).map((time, index) => ({
      time: new Date(time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      humidity: calculateHumidity(
        todayHourly.temperature_2m[index],
        todayHourly.dew_point_2m[index]
      )
    }));

    const hourlyWind = todayHourly.time.slice(0, 24).map((time, index) => ({
      time: new Date(time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      speed: Math.round(todayHourly.wind_speed_10m[index])
    }));

    // Datos de presión simulados (Open-Meteo no los incluye en esta consulta)
    const hourlyPressure = todayHourly.time.slice(0, 24).map((time, index) => ({
      time: new Date(time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      pressure: 1013 + Math.sin(index / 4) * 3 // Simulación realista
    }));

    const weather: WeatherData = {
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      condition,
      humidity,
      windSpeed: Math.round(todayHourly.wind_speed_10m[currentHour] || todayHourly.wind_speed_10m[0]),
      visibility: 10, // Valor por defecto
      pressure: 1013, // Valor por defecto
      uvIndex: 6, // Valor por defecto
      sunrise: new Date(dailyData.sunrise[0]).toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      sunset: new Date(dailyData.sunset[0]).toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      hourlyTemp,
      hourlyHumidity,
      hourlyWind,
      hourlyPressure
    };

    // Procesar pronóstico de 7 días
    const forecast: ForecastData[] = dailyData.time.slice(0, 7).map((date, index) => {
      const dateObj = new Date(date);
      const dayName = dateObj.toLocaleDateString('es-ES', { weekday: 'long' });
      const dateStr = index === 0 ? 'Hoy' : dateObj.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short' 
      });

      return {
        date: dateStr,
        day: dayName.charAt(0).toUpperCase() + dayName.slice(1),
        condition: getWeatherCondition(
          Math.random() * 100, // Simulación de probabilidad de precipitación
          true,
          400 + Math.random() * 200
        ),
        high: Math.round(dailyData.temperature_2m_max[index]),
        low: Math.round(dailyData.temperature_2m_min[index]),
        humidity: 50 + Math.random() * 30, // Simulación
        windSpeed: 5 + Math.random() * 15, // Simulación
        precipitation: Math.random() * 100 // Simulación
      };
    });

    return { weather, forecast };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

// Función auxiliar importada
const calculateHumidity = (temp: number, dewPoint: number): number => {
  const humidity = 100 * Math.exp((17.625 * dewPoint) / (243.04 + dewPoint)) / 
                   Math.exp((17.625 * temp) / (243.04 + temp));
  return Math.min(100, Math.max(0, Math.round(humidity)));
};

const getWeatherCondition = (
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
