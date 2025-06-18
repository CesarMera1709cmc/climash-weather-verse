
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  Wind, 
  Thermometer, 
  Droplets, 
  Eye, 
  Compass, 
  Sunrise, 
  Sunset,
  Search,
  MapPin,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Loader2
} from "lucide-react";
import WeatherChart from "@/components/WeatherChart";
import ForecastCard from "@/components/ForecastCard";
import WeatherMap from "@/components/WeatherMap";
import { mockAlerts } from "@/lib/mockData";
import { formatTemperature, getWeatherIcon } from "@/lib/weatherUtils";
import { fetchWeatherData, WeatherData, ForecastData } from "@/lib/weatherService";

const Index = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [alerts, setAlerts] = useState(mockAlerts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Madrid, España");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Coordenadas por defecto (Madrid)
  const [coordinates, setCoordinates] = useState({ lat: 40.4168, lon: -3.7038 });

  const loadWeatherData = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError(null);
      const { weather, forecast: forecastData } = await fetchWeatherData(lat, lon);
      setCurrentWeather(weather);
      setForecast(forecastData);
    } catch (err) {
      setError('Error al cargar los datos meteorológicos');
      console.error('Weather data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherData(coordinates.lat, coordinates.lon);
  }, [coordinates]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSelectedCity(searchQuery);
      // Aquí podrías integrar un servicio de geocodificación
      // Por ahora, mantener las coordenadas de Madrid
      loadWeatherData(coordinates.lat, coordinates.lon);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
          <p className="text-xl text-gray-600">Cargando datos meteorológicos...</p>
        </div>
      </div>
    );
  }

  if (error || !currentWeather) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="text-xl text-gray-600">{error || 'Error al cargar los datos'}</p>
          <Button onClick={() => loadWeatherData(coordinates.lat, coordinates.lon)}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  const WeatherIcon = getWeatherIcon(currentWeather.condition);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
            Climash
          </h1>
          <p className="text-xl text-gray-600">Dashboard Interactivo del Clima</p>
        </div>

        {/* Search Bar */}
        <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-xl">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Buscar ciudad..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 text-lg border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
              <Button type="submit" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8">
                Buscar
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Current Weather Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 backdrop-blur-sm bg-white/80 border-white/20 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-blue-500" />
                    {selectedCity}
                  </CardTitle>
                  <p className="text-gray-600 mt-1">
                    {new Date().toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-bold text-gray-800">
                    {formatTemperature(currentWeather.temperature)}
                  </div>
                  <p className="text-gray-600 capitalize">{currentWeather.condition}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8">
                <WeatherIcon className="h-32 w-32 text-blue-500" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center p-4 rounded-lg bg-blue-50">
                  <Thermometer className="h-6 w-6 mx-auto mb-2 text-red-500" />
                  <p className="text-sm text-gray-600">Sensación</p>
                  <p className="font-semibold">{formatTemperature(currentWeather.feelsLike)}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-cyan-50">
                  <Droplets className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                  <p className="text-sm text-gray-600">Humedad</p>
                  <p className="font-semibold">{currentWeather.humidity}%</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-gray-50">
                  <Wind className="h-6 w-6 mx-auto mb-2 text-gray-500" />
                  <p className="text-sm text-gray-600">Viento</p>
                  <p className="font-semibold">{currentWeather.windSpeed} km/h</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-purple-50">
                  <Eye className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                  <p className="text-sm text-gray-600">Visibilidad</p>
                  <p className="font-semibold">{currentWeather.visibility} km</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weather Alerts */}
          <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Alertas Meteorológicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {alerts.map((alert, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  alert.level === 'high' ? 'bg-red-50 border-red-400' :
                  alert.level === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                  'bg-blue-50 border-blue-400'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={alert.level === 'high' ? 'destructive' : 'secondary'}>
                      {alert.level === 'high' ? 'Alta' : alert.level === 'medium' ? 'Media' : 'Baja'}
                    </Badge>
                    <span className="text-sm text-gray-500">{alert.time}</span>
                  </div>
                  <h4 className="font-medium text-gray-800">{alert.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Detailed Weather Data */}
        <Tabs defaultValue="charts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="charts" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Gráficos
            </TabsTrigger>
            <TabsTrigger value="forecast" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Pronóstico
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Compass className="h-4 w-4" />
              Mapa
            </TabsTrigger>
          </TabsList>

          <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeatherChart 
                title="Temperatura (24h)"
                data={currentWeather.hourlyTemp}
                dataKey="temp"
                color="#3b82f6"
                unit="°C"
              />
              <WeatherChart 
                title="Humedad (24h)"
                data={currentWeather.hourlyHumidity}
                dataKey="humidity"
                color="#06b6d4"
                unit="%"
              />
              <WeatherChart 
                title="Velocidad del Viento (24h)"
                data={currentWeather.hourlyWind}
                dataKey="speed"
                color="#10b981"
                unit="km/h"
              />
              <WeatherChart 
                title="Presión Atmosférica (24h)"
                data={currentWeather.hourlyPressure}
                dataKey="pressure"
                color="#8b5cf6"
                unit="hPa"
              />
            </div>
          </TabsContent>

          <TabsContent value="forecast" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {forecast.map((day, index) => (
                <ForecastCard key={index} forecast={day} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <WeatherMap />
          </TabsContent>
        </Tabs>

        {/* Sun Times */}
        <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-yellow-500" />
              Horarios Solares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-orange-50">
                <Sunrise className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">Amanecer</p>
                  <p className="text-xl font-semibold">{currentWeather.sunrise}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-purple-50">
                <Sunset className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Atardecer</p>
                  <p className="text-xl font-semibold">{currentWeather.sunset}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
