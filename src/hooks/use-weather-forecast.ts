import { useState, useEffect, useCallback } from 'react';
import type { WeatherForecast } from '@/lib/types';

const POLLING_INTERVAL = 30 * 60 * 1000; // 30 minutos

interface UseWeatherForecastOptions {
  refetchInterval?: number;
}

export function useWeatherForecast(
  stationId: string | null,
  options: UseWeatherForecastOptions = {}
) {
  const { refetchInterval = POLLING_INTERVAL } = options;
  
  const [forecast, setForecast] = useState<WeatherForecast>({
    twentyFourHours: [],
    fiveDays: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    if (!stationId) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/weather/${stationId}`, {
        headers: { 'Cache-Control': 'no-store' },
      });

      if (!res.ok) {
        throw new Error(`Erro ao buscar previsão: ${res.statusText}`);
      }

      const data = await res.json();
      
      setForecast({
        twentyFourHours: data.twentyFourHours || [],
        fiveDays: data.fiveDays || [],
      });
    } catch (err) {
      console.error('Erro ao buscar previsão do tempo:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [stationId]);

  useEffect(() => {
    if (!stationId) {
      setForecast({ twentyFourHours: [], fiveDays: [] });
      return;
    }

    fetchWeather();

    // Configurar polling
    const interval = setInterval(fetchWeather, refetchInterval);

    return () => clearInterval(interval);
  }, [stationId, fetchWeather, refetchInterval]);

  return { forecast, loading, error, refetch: fetchWeather };
}
