
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://dashboard:dashboard_tekokaa_2024@localhost:5432/agrodata';

const pool = new Pool({
  connectionString,
});

async function query(text: string) {
  const client = await pool.connect();
  try {
    const res = await client.query(text);
    return res.rows;
  } finally {
    client.release();
  }
}

async function testConnection() {
  try {
    const maskedUrl = connectionString.replace(/:[^:@]*@/, ':****@');
    console.log(`Testing database connection to: ${maskedUrl}`);
    
    console.log('Testing database connection...');
    const result = await query('SELECT NOW() as now');
    console.log('Connection successful!');
    console.log('Current database time:', result[0]);

    console.log('\nFetching properties...');
    const properties = await query('SELECT * FROM tab_propriedade LIMIT 5');
    console.log(`Found ${properties.length} properties:`);
    console.table(properties);

    console.log('\nFetching stations...');
    const stations = await query('SELECT * FROM tab_estacao LIMIT 5');
    console.log(`Found ${stations.length} stations:`);
    console.table(stations);

    if (stations.length > 0) {
        const stationId = stations[0].id;
        console.log(`\nChecking history for station ${stationId}...`);
        const history = await query(`SELECT * FROM tab_medida_individual WHERE id_sensor IN (SELECT id FROM tab_sensor WHERE id_estacao = ${stationId}) ORDER BY ts_medida DESC LIMIT 5`);
        console.log(`Found ${history.length} history records for station ${stationId}:`);
        console.table(history);
    }

    process.exit(0);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

testConnection();
