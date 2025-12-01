/**
 * Client-side wrapper for database API calls (/api/db/*)
 */

export interface TabPropriedade {
  id: number;
  nome_propriedade: string;
}

export interface TabCultura {
  id: number;
  nome_cultura: string;
  id_propriedade: number;
}

export interface TabEstacao {
  id: number;
  id_propriedade: number;
  nome_estacao: string;
  descricao_estacao: string;
}

export interface TabPosEstacao {
  id: number;
  id_estacao: number;
  id_cultura: number;
  latitude: number;
  longitude: number;
  descricao_pos_estacao: string;
  pos_inicio?: string;
  pos_fim?: string;
}

export interface TabSensor {
  id: number;
  nome_sensor: string;
  id_estacao: number;
}

export interface TabGrandeza {
  id: number;
  nome_grandeza: string;
  unidade_medida?: string;
  descricao_grandeza?: string;
}

export interface TabMedidaIndividual {
  id: number;
  id_sensor: number;
  id_grandeza: number;
  valor: number;
  ts_medida: string;
}

const BASE_URL = '/api/db';

async function fetcher<T>(endpoint: string, params?: Record<string, string | number>) {
  const url = new URL(`${BASE_URL}/${endpoint}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  const res = await fetch(url.toString(), {
    headers: { 'Cache-Control': 'no-store' },
  });

  if (!res.ok) {
    throw new Error(`Erro ao buscar ${endpoint}: ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export const dbClient = {
  propriedades: () => fetcher<TabPropriedade[]>('propriedades'),
  culturas: () => fetcher<TabCultura[]>('culturas'),
  estacoes: () => fetcher<TabEstacao[]>('estacoes'),
  posicoesEstacao: () => fetcher<TabPosEstacao[]>('posicoes-estacao'),
  grandezas: () => fetcher<TabGrandeza[]>('grandezas'),
  sensores: (idEstacao: number) => fetcher<TabSensor[]>('sensores', { id_estacao: idEstacao }),
  ultimaMedidaDoSensor: (idSensor: number) => fetcher<TabMedidaIndividual | null>('ultima-medida', { id_sensor: idSensor }),
  medidasDoSensor: (idSensor: number, limit = 100) => fetcher<TabMedidaIndividual[]>('medidas', { id_sensor: idSensor, limit }),
  medidasDoSensorPorGrandeza: (idSensor: number, idGrandeza: number, limit = 100) =>
    fetcher<TabMedidaIndividual[]>('medidas', { id_sensor: idSensor, id_grandeza: idGrandeza, limit }),
};
