import { Pool } from 'pg';

// Pool de conexões PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Teste de conexão
pool.on('error', (err) => {
  console.error('Erro inesperado no pool de conexões:', err);
});

export async function query<T>(text: string, values?: (string | number | boolean | null)[]): Promise<T[]> {
  const result = await pool.query(text, values);
  return result.rows as T[];
}

export async function queryOne<T>(text: string, values?: (string | number | boolean | null)[]): Promise<T | null> {
  const result = await pool.query(text, values);
  return (result.rows[0] as T) || null;
}

export async function getConnection() {
  return pool.connect();
}

export default pool;
