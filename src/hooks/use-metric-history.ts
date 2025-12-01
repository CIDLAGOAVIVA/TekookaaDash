import { useState, useEffect } from 'react';

interface MeasurePoint {
  time: string;
  value: number;
}

interface MetricHistory {
  id: number;
  nome: string;
  nome_curto: string;
  unidade: string;
  metricKey: string;
  history: MeasurePoint[];
  current: number;
  min: number;
  max: number;
  avg: number;
}

export function useMetricHistory(stationId: string | null, sensorId?: number) {
  const [metrics, setMetrics] = useState<MetricHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stationId) {
      setMetrics([]);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar histórico de medições
        const res = await fetch(
          `/api/metric-history/${stationId}${sensorId ? `?sensorId=${sensorId}` : ''}`,
          { headers: { 'Cache-Control': 'no-store' } }
        );

        if (!res.ok) {
          throw new Error(`Erro: ${res.statusText}`);
        }

        const data = await res.json();
        setMetrics(data.metrics || []);
        console.log('Histórico carregado:', data.metrics.length, 'métricas');
      } catch (err) {
        console.error('Erro ao carregar histórico:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    })();
  }, [stationId, sensorId]);

  return { metrics, loading, error };
}
