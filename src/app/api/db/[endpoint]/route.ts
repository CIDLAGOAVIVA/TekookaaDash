import { NextRequest, NextResponse } from 'next/server';
import * as dbApi from '@/lib/db-api';

/**
 * GET /api/db/propriedades
 * Lista todas as propriedades do banco
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ endpoint: string }> }
) {
  try {
    const { endpoint } = await params;
    const { searchParams } = new URL(req.url);

    // Roteamento por endpoint
    if (endpoint === 'propriedades') {
      const data = await dbApi.propriedades();
      return NextResponse.json(data, {
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    if (endpoint === 'culturas') {
      const data = await dbApi.culturas();
      return NextResponse.json(data, {
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    if (endpoint === 'estacoes') {
      const data = await dbApi.estacoes();
      return NextResponse.json(data, {
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    if (endpoint === 'posicoes-estacao') {
      const data = await dbApi.posicoesEstacao();
      return NextResponse.json(data, {
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    if (endpoint === 'grandezas') {
      const data = await dbApi.grandezas();
      return NextResponse.json(data, {
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    if (endpoint === 'sensores') {
      const idEstacao = searchParams.get('id_estacao');
      if (!idEstacao) {
        return NextResponse.json(
          { error: 'Parâmetro id_estacao é obrigatório' },
          { status: 400 }
        );
      }
      const data = await dbApi.sensores(parseInt(idEstacao));
      return NextResponse.json(data, {
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    if (endpoint === 'ultima-medida') {
      const idSensor = searchParams.get('id_sensor');
      if (!idSensor) {
        return NextResponse.json(
          { error: 'Parâmetro id_sensor é obrigatório' },
          { status: 400 }
        );
      }
      const data = await dbApi.ultimaMedidaDoSensor(parseInt(idSensor));
      return NextResponse.json(data, {
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    if (endpoint === 'medidas') {
      const idSensor = searchParams.get('id_sensor');
      const idGrandeza = searchParams.get('id_grandeza');
      const limit = parseInt(searchParams.get('limit') || '100');

      if (!idSensor) {
        return NextResponse.json(
          { error: 'Parâmetro id_sensor é obrigatório' },
          { status: 400 }
        );
      }

      let data;
      if (idGrandeza) {
        data = await dbApi.medidasDoSensorPorGrandeza(
          parseInt(idSensor),
          parseInt(idGrandeza),
          limit
        );
      } else {
        data = await dbApi.medidasDoSensor(parseInt(idSensor), limit);
      }

      return NextResponse.json(data, {
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    return NextResponse.json({ error: 'Endpoint não encontrado' }, { status: 404 });
  } catch (error) {
    console.error('Erro ao consultar banco:', error);
    return NextResponse.json(
      { error: 'Erro ao consultar banco de dados' },
      { status: 500 }
    );
  }
}
