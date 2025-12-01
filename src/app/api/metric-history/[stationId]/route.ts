import { NextRequest, NextResponse } from 'next/server';
import * as dbApi from '@/lib/db-api';
import { GRANDEZA_TO_METRIC_BY_ID } from '@/lib/grandeza-map';

/**
 * GET /api/metric-history/[stationId]
 * Busca o histórico completo de medições para uma estação
 * Query params:
 *   - limit: número máximo de registros por sensor (default 100)
 *   - sensorId: filtrar por sensor específico
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ stationId: string }> }
) {
  try {
    const { stationId } = await params;
    const idEstacao = parseInt(stationId);
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const sensorId = url.searchParams.get('sensorId') ? parseInt(url.searchParams.get('sensorId')!) : null;

    if (isNaN(idEstacao)) {
      return NextResponse.json(
        { error: 'ID da estação inválido' },
        { status: 400 }
      );
    }

    // Buscar sensores da estação
    let sensores = await dbApi.sensores(idEstacao);
    if (sensorId) {
      sensores = sensores.filter(s => s.id === sensorId);
    }

    if (sensores.length === 0) {
      return NextResponse.json(
        { metrics: [], count: 0, message: 'Nenhum sensor encontrado' },
        { headers: { 'Cache-Control': 'no-store' } }
      );
    }

    // Buscar grandezas
    const grandezas = await dbApi.grandezas();
    const grandezaById = new Map(grandezas.map(g => [g.id, g]));

    // Buscar histórico por sensor
    const metricsMap = new Map<number, any>();

    for (const sensor of sensores) {
      // Buscar histórico completo (sem DISTINCT, apenas ordenado por timestamp DESC)
      const medidas = await dbApi.historicoMedidasDoSensor(sensor.id, limit);

      // Agrupar por grandeza, mantendo ordem cronológica invertida
      const grandezaMap = new Map<number, any[]>();
      for (const medida of medidas) {
        if (!grandezaMap.has(medida.id_grandeza)) {
          grandezaMap.set(medida.id_grandeza, []);
        }
        grandezaMap.get(medida.id_grandeza)!.push(medida);
      }

      // Processar cada grandeza
      for (const [idGrandeza, medicoes] of grandezaMap.entries()) {
        const grandeza = grandezaById.get(idGrandeza);
        if (!grandeza) continue;

        const metricKey = GRANDEZA_TO_METRIC_BY_ID[grandeza.id] || grandeza.nome_grandeza;

        // Calcular estatísticas
        const valores = medicoes.map(m => Number(m.valor));
        const min = Math.min(...valores);
        const max = Math.max(...valores);
        const avg = valores.reduce((a, b) => a + b, 0) / valores.length;

        // Converter para pontos de gráfico (reverter para ordem chronológica)
        const history = medicoes
          .reverse()
          .map(m => ({
            time: new Date(m.ts_medida).toISOString(),
            value: Number(m.valor)
          }));

        // Usar como chave a combinação sensor+grandeza
        const key = `${sensor.id}_${idGrandeza}`;
        
        metricsMap.set(key, {
          id: grandeza.id,
          nome: grandeza.descricao_grandeza || grandeza.nome_grandeza,
          nome_curto: grandeza.nome_grandeza,
          unidade: grandeza.unidade_medida || '',
          metricKey,
          sensorId: sensor.id,
          sensorName: sensor.nome_sensor,
          history,
          current: medicoes[0].valor, // A mais recente (primeiro após reverse)
          min,
          max,
          avg: parseFloat(avg.toFixed(2)),
        });
      }
    }

    const metrics = Array.from(metricsMap.values());

    return NextResponse.json(
      {
        stationId: idEstacao,
        metrics,
        count: metrics.length,
        limit,
        timestamp: new Date().toISOString(),
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('Erro ao buscar histórico de métricas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar histórico de métricas' },
      { status: 500 }
    );
  }
}
