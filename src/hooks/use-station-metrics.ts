import { useState, useEffect, useRef } from 'react';
import type { SensorData } from '@/lib/types';
import { iconForMetricName } from '@/lib/metric-icons';

interface StationMetric {
  id: number;
  nome: string;
  nome_curto: string;
  unidade: string;
  valor: number;
  ts_medida: string;
  id_sensor: number;
  nome_sensor: string;
  metricKey?: string;
}

const POLLING_INTERVAL = 10000; // 10 segundos
const MAX_TREND_POINTS = 100; // Manter últimos 100 pontos

export function useStationMetrics(stationId: string | null, refetchInterval = POLLING_INTERVAL) {
  const [metrics, setMetrics] = useState<StationMetric[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sensorData, setSensorData] = useState<Partial<SensorData>>({});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const trendHistoryRef = useRef<Map<string, Array<{ time: string; value: number }>>>(new Map());

  const fetchMetrics = async () => {
    if (!stationId) return;

    try {
      setError(null);
      const res = await fetch(`/api/station-metrics/${stationId}`, {
        headers: { 'Cache-Control': 'no-store' },
      });

      if (!res.ok) {
        throw new Error(`Erro: ${res.statusText}`);
      }

      const data = await res.json();
      setMetrics(data.metrics || []);

      // Converter métricas para SensorData format, acumulando histórico
      const sensorDataMap: Partial<SensorData> = {};
      (data.metrics || []).forEach((metric: StationMetric) => {
        const key = metric.metricKey as keyof SensorData;
        if (key) {
          const icon = iconForMetricName(metric.nome_curto, metric.unidade);
          const timePoint = { time: new Date(metric.ts_medida).toISOString(), value: metric.valor };
          
          // Obter histórico existente ou criar novo
          const keyStr = String(key);
          let trendPoints = trendHistoryRef.current.get(keyStr) || [];
          
          // Adicionar novo ponto (evitar duplicatas do mesmo timestamp)
          const lastPoint = trendPoints[trendPoints.length - 1];
          if (!lastPoint || lastPoint.time !== timePoint.time) {
            trendPoints = [...trendPoints, timePoint];
            // Limitar ao máximo de pontos
            if (trendPoints.length > MAX_TREND_POINTS) {
              trendPoints = trendPoints.slice(-MAX_TREND_POINTS);
            }
            trendHistoryRef.current.set(keyStr, trendPoints);
          }

          sensorDataMap[key] = {
            name: metric.nome,
            value: metric.valor,
            unit: metric.unidade,
            icon,
            trend: trendPoints,
          };
        }
      });

      setSensorData(sensorDataMap);
      console.log('Métricas atualizadas:', new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Erro ao carregar métricas da estação:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  };

  useEffect(() => {
    if (!stationId) {
      setMetrics([]);
      setSensorData({});
      trendHistoryRef.current.clear();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Busca inicial
    setLoading(true);
    fetchMetrics().finally(() => setLoading(false));

    // Configurar polling automático
    intervalRef.current = setInterval(() => {
      fetchMetrics();
    }, refetchInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [stationId, refetchInterval]);

  return { metrics, loading, error, sensorData };
}
