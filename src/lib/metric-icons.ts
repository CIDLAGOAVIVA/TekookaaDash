import { 
  Thermometer,      // temperatura
  Droplets,         // umidade
  Wind,             // vento
  FlaskConical,     // pH
  Zap,              // condutividade
  Sprout,           // nutrientes (N)
  Leaf,             // nutrientes (P, K)
  CloudDrizzle,     // precipitação, chuva
  Sun,              // UV
  Gauge,            // genérico
  Navigation,       // direção vento
  Compass,          // quadrante vento
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { MetricKey } from './grandeza-map';

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos
    .trim();
}

// Mapeamento direto por MetricKey
export function iconForMetricKey(key: MetricKey): LucideIcon {
  switch (key) {
    case 'airTemperature': return Thermometer;
    case 'airHumidity': return Droplets;
    case 'windSpeed': return Wind;
    case 'windDirection': return Navigation;
    case 'windQuadrant': return Compass;
    case 'soilPH': return FlaskConical;
    case 'electricalConductivity': return Zap;
    case 'nitrogen': return Sprout;
    case 'phosphorus': return Leaf;
    case 'potassium': return Leaf;
    case 'soilMoisture': return Droplets;
    case 'co2': return CloudDrizzle;
    case 'precipitation': return CloudDrizzle;
    case 'rainDetection': return CloudDrizzle;
    case 'ultravioletIndex': return Sun;
    default: return Gauge;
  }
}

// Mapeamento por abreviação (fallback para nomes do banco)
export function iconForMetricName(name: string, unit?: string): LucideIcon {
  const n = normalize(name);
  const u = unit ? normalize(unit) : '';

  // Abreviações exatas do banco
  if (n === 't') return Thermometer;      // temperatura
  if (n === 'h') return Droplets;         // umidade do ar
  if (n === 'm') return Droplets;         // umidade do solo
  if (n === 's') return Wind;             // velocidade do vento
  if (n === 'dc') return Compass;         // quadrante vento
  if (n === 'dg') return Navigation;      // direção vento
  if (n === 'ph') return FlaskConical;    // pH
  if (n === 'ec') return Zap;             // condutividade
  if (n === 'n') return Sprout;           // nitrogênio
  if (n === 'p') return Leaf;             // fósforo
  if (n === 'k') return Leaf;             // potássio
  if (n === 'ppm') return CloudDrizzle;   // CO₂
  if (n === 'mm') return CloudDrizzle;    // precipitação
  if (n === 'an') return CloudDrizzle;    // detecção chuva
  if (n === 'raw') return Sun;            // UV

  // Fallback por descrição completa
  if (n.includes('temperatura')) return Thermometer;
  if (n.includes('umidade')) return Droplets;
  if (n.includes('vento') || n.includes('anemometro')) return Wind;
  if (n.includes('ph')) return FlaskConical;
  if (n.includes('condutividade')) return Zap;
  if (n.includes('nitrogenio')) return Sprout;
  if (n.includes('fosforo') || n.includes('potassio')) return Leaf;
  if (n.includes('co2') || n.includes('co²') || n.includes('chuva') || n.includes('precipitacao')) return CloudDrizzle;
  if (n.includes('ultravioleta') || n.includes('uv')) return Sun;

  return Gauge; // default
}
