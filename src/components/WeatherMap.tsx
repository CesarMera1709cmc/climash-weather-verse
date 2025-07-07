import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Thermometer } from "lucide-react";

type City = {
  name: string;
  country: string;
  lat: number;
  lng: number;
  temp?: number;
  condition?: string;
};

const majorCities: City[] = [
  { name: "Madrid", country: "España", lat: 40.4168, lng: -3.7038 },
  { name: "Barcelona", country: "España", lat: 41.3851, lng: 2.1734 },
  { name: "París", country: "Francia", lat: 48.8566, lng: 2.3522 },
  { name: "Londres", country: "Reino Unido", lat: 51.5074, lng: -0.1278 },
  { name: "Roma", country: "Italia", lat: 41.9028, lng: 12.4964 },
  { name: "Berlín", country: "Alemania", lat: 52.5200, lng: 13.4050 },
];

const getCondition = (temp: number | undefined) => {
  if (temp === undefined) return "desconocido";
  if (temp >= 20) return "soleado";
  if (temp >= 10) return "nublado";
  return "lluvioso";
};

const getConditionColor = (condition: string) => {
  switch (condition) {
    case "soleado": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "nublado": return "bg-gray-100 text-gray-800 border-gray-200";
    case "lluvioso": return "bg-blue-100 text-blue-800 border-blue-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const WeatherMap = () => {
  const [cities, setCities] = useState<City[]>(majorCities);

  useEffect(() => {
    const fetchCityWeather = async (city: City) => {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&current=temperature_2m&timezone=America%2FChicago`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        const temp = data.current?.temperature_2m;
        return {
          ...city,
          temp,
          condition: getCondition(temp),
        };
      } catch {
        return {
          ...city,
          temp: undefined,
          condition: "desconocido",
        };
      }
    };

    Promise.all(majorCities.map(fetchCityWeather)).then(setCities);
  }, []);

  return (
    <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-500" />
          Mapa del Clima - Principales Ciudades
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-96 bg-gradient-to-br from-blue-100 via-green-50 to-yellow-50 rounded-lg border-2 border-gray-200 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 400 300">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#94a3b8" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {cities.map((city, index) => (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
              style={{
                left: `${(city.lng + 180) * (100/360)}%`,
                top: `${(90 - city.lat) * (100/180)}%`
              }}
            >
              <div className="bg-white rounded-lg shadow-lg p-3 border-2 border-blue-200 hover:shadow-xl transition-all duration-300 hover:scale-110">
                <div className="text-center space-y-2">
                  <div className="flex items-center gap-1 justify-center">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span className="font-semibold text-sm">{city.name}</span>
                  </div>
                  <p className="text-xs text-gray-600">{city.country}</p>
                  <div className="flex items-center gap-1 justify-center">
                    <Thermometer className="h-4 w-4 text-red-400" />
                    <span className="font-bold text-lg">
                      {city.temp !== undefined ? `${city.temp}°C` : "--"}
                    </span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getConditionColor(city.condition ?? "desconocido")}`}
                  >
                    {city.condition ?? "desconocido"}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-50">
            <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
            <span className="text-sm">Soleado (20°C+)</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
            <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
            <span className="text-sm">Nublado (10-20°C)</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50">
            <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
            <span className="text-sm">Lluvioso (0-15°C)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherMap;