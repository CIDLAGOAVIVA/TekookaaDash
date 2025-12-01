import { query, queryOne } from './db';

export interface TabPropriedade {
  id: number;
  nome_propriedade: string;
  localizacao?: string;
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

export interface TabMedicao {
  id: number;
  id_sensor: number;
  data_medicao: string;
  hora_medicao?: string;
}

export async function propriedades(): Promise<TabPropriedade[]> {
  return query<TabPropriedade>('SELECT id, nome_propriedade FROM tab_propriedade ORDER BY id');
}

export async function culturas(): Promise<TabCultura[]> {
  return query<TabCultura>('SELECT id, nome_cultura, id_propriedade FROM tab_cultura ORDER BY id');
}

export async function estacoes(): Promise<TabEstacao[]> {
  return query<TabEstacao>('SELECT id, id_propriedade, nome_estacao, descricao_estacao FROM tab_estacao ORDER BY id');
}

export async function posicoesEstacao(): Promise<TabPosEstacao[]> {
  return query<TabPosEstacao>('SELECT id, id_estacao, id_cultura, latitude, longitude, descricao_pos_estacao, pos_inicio, pos_fim FROM tab_pos_estacao ORDER BY id');
}

export async function sensores(idEstacao: number): Promise<TabSensor[]> {
  return query<TabSensor>(
    'SELECT id, nome_sensor, id_estacao FROM tab_sensor WHERE id_estacao = $1 ORDER BY id',
    [idEstacao]
  );
}

export async function grandezas(): Promise<TabGrandeza[]> {
  return query<TabGrandeza>(
    'SELECT id, nome_grandeza, unidade_medida, descricao_grandeza FROM tab_grandeza ORDER BY id'
  );
}

export async function ultimaMedidaDoSensor(idSensor: number): Promise<TabMedidaIndividual | null> {
  return queryOne<TabMedidaIndividual>(
    'SELECT id, id_sensor, id_grandeza, valor, ts_medida FROM tab_medida_individual WHERE id_sensor = $1 ORDER BY ts_medida DESC LIMIT 1',
    [idSensor]
  );
}

export async function medidasDoSensor(idSensor: number, limit = 100): Promise<TabMedidaIndividual[]> {
  return query<TabMedidaIndividual>(
    `SELECT DISTINCT ON (id_grandeza) id, id_sensor, id_grandeza, valor, ts_medida 
     FROM tab_medida_individual 
     WHERE id_sensor = $1 
     ORDER BY id_grandeza, ts_medida DESC`,
    [idSensor]
  );
}

export async function medidasDoSensorPorGrandeza(idSensor: number, idGrandeza: number, limit = 100): Promise<TabMedidaIndividual[]> {
  return query<TabMedidaIndividual>(
    'SELECT id, id_sensor, id_grandeza, valor, ts_medida FROM tab_medida_individual WHERE id_sensor = $1 AND id_grandeza = $2 ORDER BY ts_medida DESC LIMIT $3',
    [idSensor, idGrandeza, limit]
  );
}

export async function historicoMedidasDoSensor(idSensor: number, limit = 100): Promise<TabMedidaIndividual[]> {
  return query<TabMedidaIndividual>(
    'SELECT id, id_sensor, id_grandeza, valor, ts_medida FROM tab_medida_individual WHERE id_sensor = $1 ORDER BY ts_medida DESC LIMIT $2',
    [idSensor, limit]
  );
}
