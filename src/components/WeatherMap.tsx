
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Thermometer } from "lucide-react";

const WeatherMap = () => {
  // Datos simulados de ciudades principales
  const majorCities = [
    { name: "Madrid", country: "España", temp: 22, condition: "soleado", lat: 40.4168, lng: -3.7038 },
    { name: "Barcelona", country: "España", temp: 25, condition: "nublado", lat: 41.3851, lng: 2.1734 },
    { name: "París", country: "Francia", temp: 18, condition: "lluvioso", lat: 48.8566, lng: 2.3522 },
    { name: "Londres", country: "Reino Unido", temp: 15, condition: "nublado", lat: 51.5074, lng: -0.1278 },
    { name: "Roma", country: "Italia", temp: 27, condition: "soleado", lat: 41.9028, lng: 12.4964 },
    { name: "Berlín", country: "Alemania", temp: 19, condition: "nublado", lat: 52.5200, lng: 13.4050 },
  ];

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "soleado": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "nublado": return "bg-gray-100 text-gray-800 border-gray-200";
      case "lluvioso": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-500" />
          Mapa del Clima - Principales Ciudades
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Simulación de mapa con gradiente de fondo */}
        <div className="relative h-96 bg-gradient-to-br from-blue-100 via-green-50 to-yellow-50 rounded-lg border-2 border-gray-200 overflow-hidden">
          {/* Efecto de mapa de fondo */}
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

          {/* Ciudades en el mapa */}
          {majorCities.map((city, index) => (
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
                    <span className="font-bold text-lg">{city.temp}°</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getConditionColor(city.condition)}`}
                  >
                    {city.condition}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Leyenda del mapa */}
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
