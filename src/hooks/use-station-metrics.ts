import { useState, useEffect, useRef, useCallback } from 'react';
import type { SensorData } from '@/lib/types';
import { iconForMetricName } from '@/lib/metric-icons';

interface StationMetric {
  id: number;
  nome: string;
  nome_curto: string;
  unidade: string;
  valor: number;
  valor_raw?: number;
  ts_medida: string;
  id_sensor: number;
  nome_sensor: string;
  metricKey?: string;
}

interface HistoryMetric {
  id: number;
  nome: string;
  nome_curto: string;
  unidade: string;
  metricKey: string;
  history: Array<{ time: string; value: number }>;
  current: number;
  min: number;
  max: number;
  avg: number;
}

const POLLING_INTERVAL = 10000; // 10 segundos
const MAX_TREND_POINTS = 500; // Aumentado para comportar mais histórico

interface UseStationMetricsOptions {
  refetchInterval?: number;
  historyMinutes?: number;
}

export function useStationMetrics(
  stationId: string | null, 
  options: UseStationMetricsOptions = {}
) {
  const { refetchInterval = POLLING_INTERVAL, historyMinutes = 120 } = options;
  
  const [metrics, setMetrics] = useState<StationMetric[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sensorData, setSensorData] = useState<Partial<SensorData>>({});
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const trendHistoryRef = useRef<Map<string, Array<{ time: string; value: number }>>>(new Map());

  // Carregar histórico inicial
  const loadInitialHistory = useCallback(async () => {
    if (!stationId) return;

    try {
      console.log(`Carregando histórico de ${historyMinutes} minutos...`);
      const res = await fetch(
        `/api/metric-history/${stationId}?minutes=${historyMinutes}`,
        { headers: { 'Cache-Control': 'no-store' } }
      );

      if (!res.ok) {
        throw new Error(`Erro: ${res.statusText}`);
      }

      const data = await res.json();
      const historyMetrics: HistoryMetric[] = data.metrics || [];

      // Inicializar o histórico para cada métrica
      historyMetrics.forEach((metric: HistoryMetric) => {
        const keyStr = metric.metricKey;
        if (keyStr && metric.history.length > 0) {
          trendHistoryRef.current.set(keyStr, metric.history);
        }
      });

      console.log(`Histórico carregado: ${historyMetrics.length} métricas`);
      setHistoryLoaded(true);
    } catch (err) {
      console.error('Erro ao carregar histórico inicial:', err);
      setHistoryLoaded(true); // Marcar como carregado mesmo com erro para não bloquear
    }
  }, [stationId, historyMinutes]);

  const fetchMetrics = useCallback(async () => {
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
          const timePoint = { 
            time: new Date(metric.ts_medida).toISOString(), 
            value: metric.valor_raw !== undefined ? metric.valor_raw : metric.valor 
          };
          
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
  }, [stationId]);

  useEffect(() => {
    if (!stationId) {
      setMetrics([]);
      setSensorData({});
      trendHistoryRef.current.clear();
      setHistoryLoaded(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Busca inicial: primeiro carregar histórico, depois métricas atuais
    setLoading(true);
    setHistoryLoaded(false);
    trendHistoryRef.current.clear();

    (async () => {
      // Carregar histórico primeiro
      await loadInitialHistory();
      // Depois carregar métricas atuais
      await fetchMetrics();
      setLoading(false);
    })();

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
  }, [stationId, refetchInterval, historyMinutes, loadInitialHistory, fetchMetrics]);

  return { metrics, loading, error, sensorData, historyLoaded };
}
