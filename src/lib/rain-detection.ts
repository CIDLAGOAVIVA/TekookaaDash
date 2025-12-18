/**
 * Funções para interpretar leituras do sensor de detecção de chuva
 * 
 * O sensor de chuva baseado em condutividade funciona assim:
 * - Valor 4095 (máximo em 12 bits): Sensor completamente seco, sem chuva
 * - Valor 0: Sensor completamente molhado, chuva intensa
 * 
 * A resistência elétrica aumenta com a ausência de água, 
 * e diminui conforme gotas de água fecham o circuito na superfície do sensor.
 */

export interface RainLevel {
  level: 'dry' | 'mist' | 'light' | 'moderate' | 'heavy' | 'intense';
  label: string;
  description: string;
  color: string;
}

/**
 * Converte o valor bruto do sensor de chuva (0-4095) para uma descrição qualitativa
 * @param rawValue - Valor do sensor (0-4095 para ADC de 12 bits)
 * @returns Objeto com nível, rótulo e descrição
 */
export function interpretRainSensor(rawValue: number): RainLevel {
  // Normalizar valor para garantir que está no range esperado
  const value = Math.max(0, Math.min(4095, rawValue));
  
  // Calcular percentual de umidade (invertido - 0% = seco, 100% = muito molhado)
  const moisturePercent = ((4095 - value) / 4095) * 100;
  
  if (moisturePercent <= 1) {
    return {
      level: 'dry',
      label: 'Seco',
      description: 'Sem detecção de chuva',
      color: 'text-green-600',
    };
  } else if (moisturePercent <= 10) {
    return {
      level: 'mist',
      label: 'Neblina/Orvalho',
      description: 'Umidade leve detectada',
      color: 'text-blue-400',
    };
  } else if (moisturePercent <= 30) {
    return {
      level: 'light',
      label: 'Chuva Fraca',
      description: 'Chuva leve ou garoa',
      color: 'text-blue-500',
    };
  } else if (moisturePercent <= 60) {
    return {
      level: 'moderate',
      label: 'Chuva Moderada',
      description: 'Chuva moderada detectada',
      color: 'text-blue-600',
    };
  } else if (moisturePercent <= 85) {
    return {
      level: 'heavy',
      label: 'Chuva Forte',
      description: 'Chuva forte detectada',
      color: 'text-blue-700',
    };
  } else {
    return {
      level: 'intense',
      label: 'Chuva Intensa',
      description: 'Chuva muito intensa',
      color: 'text-blue-900',
    };
  }
}

/**
 * Retorna o ícone apropriado baseado no nível de chuva
 * @param level - Nível da chuva
 * @returns Nome do ícone Lucide
 */
export function getRainIcon(level: RainLevel['level']): string {
  switch (level) {
    case 'dry':
      return 'Sun';
    case 'mist':
      return 'CloudDrizzle';
    case 'light':
      return 'CloudDrizzle';
    case 'moderate':
      return 'CloudRain';
    case 'heavy':
      return 'CloudRain';
    case 'intense':
      return 'CloudLightning';
    default:
      return 'Cloud';
  }
}

/**
 * Formata o valor do sensor de chuva para exibição
 * @param rawValue - Valor bruto do sensor
 * @returns String formatada para exibição
 */
export function formatRainValue(rawValue: number): string {
  const interpretation = interpretRainSensor(rawValue);
  return interpretation.label;
}
