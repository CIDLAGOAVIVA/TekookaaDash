export type MetricKey =
  | 'airTemperature'
  | 'electricalConductivity'
  | 'soilPH'
  | 'nitrogen'
  | 'phosphorus'
  | 'potassium'
  | 'co2'
  | 'precipitation'
  | 'rainDetection'
  | 'soilMoisture'
  | 'ultravioletIndex'
  | 'windSpeed'
  | 'windQuadrant'
  | 'windDirection'
  | 'airHumidity';

// Mapeamento explícito por ID (baseado no banco de dados real)
// IDs reais: 37, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57
export const GRANDEZA_TO_METRIC_BY_ID: Record<number, MetricKey> = {
  37: 'airTemperature',           // t - temperatura (°C)
  44: 'electricalConductivity',   // ec - condutividade elétrica (℧)
  45: 'soilPH',                   // ph - pH do solo
  46: 'nitrogen',                 // n - concentração de nitrogênio
  47: 'phosphorus',               // p - concentração de fósforo
  48: 'potassium',                // k - concentração de potássio
  49: 'co2',                      // ppm - concentração de CO₂ (ppm)
  50: 'precipitation',            // mm - precipitação (mm)
  51: 'rainDetection',            // an - detecção de chuva
  52: 'soilMoisture',             // m - umidade do solo (%)
  53: 'ultravioletIndex',         // raw - índice ultravioleta bruto
  54: 'windSpeed',                // s - velocidade do vento (m/s)
  55: 'windQuadrant',             // dc - quadrante da direção do vento
  56: 'windDirection',            // dg - direção do vento (°)
  57: 'airHumidity',              // h - umidade do ar (%)
};

// Mapeamento por nome/abreviação (fallback)
export const GRANDEZA_TO_METRIC_BY_NAME: Record<string, MetricKey> = {
  t: 'airTemperature',
  ec: 'electricalConductivity',
  ph: 'soilPH',
  n: 'nitrogen',
  p: 'phosphorus',
  k: 'potassium',
  ppm: 'co2',
  mm: 'precipitation',
  an: 'rainDetection',
  m: 'soilMoisture',
  raw: 'ultravioletIndex',
  s: 'windSpeed',
  dc: 'windQuadrant',
  dg: 'windDirection',
  h: 'airHumidity',
};
