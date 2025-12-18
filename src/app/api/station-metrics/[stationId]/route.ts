import { NextRequest, NextResponse } from 'next/server';
import * as dbApi from '@/lib/db-api';
import { GRANDEZA_TO_METRIC_BY_ID, GRANDEZA_DISPLAY_NAME } from '@/lib/grandeza-map';

// Cache simples em memória com TTL
const metricsCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 2000; // 2 segundos

/**
 * GET /api/station-metrics/[stationId]
 * Busca todas as últimas medidas por grandeza para uma estação
 * Retorna um objeto com as métricas agregadas
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ stationId: string }> }
) {
  try {
    const { stationId } = await params;
    const idEstacao = parseInt(stationId);

    if (isNaN(idEstacao)) {
      return NextResponse.json(
        { metrics: [], count: 0, message: 'ID de estação não numérico (possivelmente mock)' },
        { status: 200 }
      );
    }

    // Verificar cache
    const cacheKey = `station-${idEstacao}`;
    const cached = metricsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data, {
        headers: { 'Cache-Control': 'no-store', 'X-Cache': 'HIT' }
      });
    }

    // Buscar sensores da estação
    const sensores = await dbApi.sensores(idEstacao);
    if (sensores.length === 0) {
      const response = {
        metrics: [],
        count: 0,
        message: 'Nenhum sensor encontrado para esta estação'
      };
      metricsCache.set(cacheKey, { data: response, timestamp: Date.now() });
      return NextResponse.json(response, {
        headers: { 'Cache-Control': 'no-store' }
      });
    }

    // Buscar grandezas
    const grandezas = await dbApi.grandezas();
    const grandezaById = new Map(grandezas.map(g => [g.id, g]));

    // Buscar última medida por sensor
    const metricsMap = new Map<number, any>();

    for (const sensor of sensores) {
      // Buscar TODAS as medidas (não apenas 1) para pegar todas as grandezas
      const medidas = await dbApi.medidasDoSensor(sensor.id, 1000);
      
      for (const medida of medidas) {
        const grandeza = grandezaById.get(medida.id_grandeza);
        if (!grandeza) continue;

        // Usar mapeamento explícito ou nome da grandeza
        const metricKey = GRANDEZA_TO_METRIC_BY_ID[grandeza.id] || grandeza.nome_grandeza;
        
        // Guardar a última medida por grandeza (key = id_grandeza para evitar duplicatas)
        if (!metricsMap.has(medida.id_grandeza)) {
          let valor = medida.valor;

          // Se for precipitação (ID 50), calcular o somatório do dia
          if (grandeza.id === 50) {
            valor = await dbApi.getDailyPrecipitationSum(sensor.id, grandeza.id);
          }

          metricsMap.set(medida.id_grandeza, {
            id: grandeza.id,
            nome: GRANDEZA_DISPLAY_NAME[grandeza.id] || grandeza.descricao_grandeza || grandeza.nome_grandeza,
            nome_curto: grandeza.nome_grandeza,
            unidade: grandeza.unidade_medida || '',
            valor,
            valor_raw: medida.valor,
            ts_medida: medida.ts_medida,
            id_sensor: medida.id_sensor,
            nome_sensor: sensor.nome_sensor,
            metricKey,
          });
        }
      }
    }

    const metrics = Array.from(metricsMap.values());

    const response = {
      stationId: idEstacao,
      metrics,
      count: metrics.length,
      timestamp: new Date().toISOString(),
    };

    // Salvar em cache
    metricsCache.set(cacheKey, { data: response, timestamp: Date.now() });

    return NextResponse.json(response, {
      headers: { 'Cache-Control': 'no-store', 'X-Cache': 'MISS' }
    });
  } catch (error) {
    console.error('Erro ao buscar métricas da estação:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar métricas da estação' },
      { status: 500 }
    );
  }
}


