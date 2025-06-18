
import { Card, CardContent } from "@/components/ui/card";
import { getWeatherIcon, formatTemperature } from "@/lib/weatherUtils";
import { Droplets, Wind } from "lucide-react";

interface ForecastData {
  date: string;
  day: string;
  condition: string;
  high: number;
  low: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
}

interface ForecastCardProps {
  forecast: ForecastData;
}

const ForecastCard = ({ forecast }: ForecastCardProps) => {
  const WeatherIcon = getWeatherIcon(forecast.condition);

  return (
    <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
      <CardContent className="p-6 text-center">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-800">{forecast.day}</h3>
            <p className="text-sm text-gray-600">{forecast.date}</p>
          </div>
          
          <div className="flex justify-center">
            <WeatherIcon className="h-16 w-16 text-blue-500" />
          </div>
          
          <div>
            <p className="text-sm text-gray-600 capitalize mb-2">{forecast.condition}</p>
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-800">
                {formatTemperature(forecast.high)}
              </span>
              <span className="text-lg text-gray-500">
                {formatTemperature(forecast.low)}
              </span>
            </div>
          </div>
          
          <div className="space-y-2 pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span className="text-gray-600">Humedad</span>
              </div>
              <span className="font-medium">{forecast.humidity}%</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <Wind className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Viento</span>
              </div>
              <span className="font-medium">{forecast.windSpeed} km/h</span>
            </div>
            
            {forecast.precipitation > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Precipitación</span>
                <span className="font-medium text-blue-600">{forecast.precipitation}%</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastCard;
