import type { Property } from '@/lib/types';
import { Thermometer, Droplets, FlaskConical, Sun, Wind, Leaf, Zap, Heater, Sprout, CloudDrizzle, Navigation, Compass, CloudRain, Cloud } from 'lucide-react';

const generateTrend = (base: number, points = 7, fluctuation = 0.1) => {
  return Array.from({ length: points }, (_, i) => ({
    time: `Dia ${i + 1}`,
    value: parseFloat((base + (Math.random() - 0.5) * (base * fluctuation)).toFixed(1)),
  }));
};

const station1: Property['crops'][0]['stations'][0] = {
  id: 'st1',
  name: 'Estação 01 - Setor Norte',
  location: { lat: -23.5505, lng: -46.6333 },
  sensorData: {
    soilMoisture: { name: 'Umidade do Solo', value: 35, unit: '%', trend: generateTrend(35), icon: Droplets },
    airTemperature: { name: 'Temperatura do Ar', value: 24, unit: '°C', trend: generateTrend(24), icon: Thermometer },
    soilPH: { name: 'pH do Solo', value: 6.8, unit: '', trend: generateTrend(6.8), icon: FlaskConical },
    luminosity: { name: 'Ultravioleta', value: 55000, unit: 'Lux', trend: generateTrend(55000), icon: Sun },
    airHumidity: { name: 'Umidade do Ar', value: 60, unit: '%', trend: generateTrend(60), icon: Droplets },
    windSpeed: { name: 'Velocidade do Vento', value: 15, unit: 'km/h', trend: generateTrend(15), icon: Wind },
    soilTemperature: { name: 'Temperatura do Solo', value: 22, unit: '°C', trend: generateTrend(22), icon: Heater },
    electricalConductivity: { name: 'Condutividade Elétrica', value: 1.2, unit: 'mS/cm', trend: generateTrend(1.2), icon: Zap },
    nitrogen: { name: 'Nitrogênio (N)', value: 120, unit: 'kg/ha', trend: generateTrend(120), icon: Sprout },
    phosphorus: { name: 'Fósforo (P)', value: 80, unit: 'kg/ha', trend: generateTrend(80), icon: Leaf },
    potassium: { name: 'Potássio (K)', value: 150, unit: 'kg/ha', trend: generateTrend(150), icon: Leaf },
    evapotranspiration: { name: 'Precipitação', value: 3.2, unit: 'mm/dia', trend: generateTrend(3.2), icon: CloudDrizzle },
    windDirection: { name: 'Direção do Vento', value: 225, unit: '°', trend: generateTrend(225, 7, 0.2), icon: Navigation },
    windDirectionQuadrant: { name: 'Quadrante do Vento', value: 3, unit: '', trend: generateTrend(3, 7, 0.3), icon: Compass },
    airCO2: { name: 'CO₂ no Ar', value: 410, unit: 'ppm', trend: generateTrend(410), icon: Cloud },
    rainIndicator: { name: 'Indicador de Chuva', value: 1, unit: '', trend: generateTrend(1, 7, 1), icon: CloudRain },
  },
  weatherForecast: {
    twentyFourHours: Array.from({ length: 8 }, (_, i) => ({
      time: `${String(new Date().getHours() + i * 3).padStart(2, '0')}:00`,
      temp: 24 + Math.round((Math.random() - 0.5) * 5),
      icon: Math.random() > 0.7 ? 'CloudRain' : 'CloudSun',
      precipitation: Math.floor(Math.random() * 40),
    })),
    fiveDays: [
      { day: 'Hoje', maxTemp: 28, minTemp: 18, icon: 'CloudSun', precipitation: 20 },
      { day: 'Amanhã', maxTemp: 29, minTemp: 19, icon: 'Sun', precipitation: 10 },
      { day: 'Qua', maxTemp: 27, minTemp: 17, icon: 'CloudRain', precipitation: 60 },
      { day: 'Qui', maxTemp: 26, minTemp: 16, icon: 'Cloudy', precipitation: 40 },
      { day: 'Sex', maxTemp: 28, minTemp: 18, icon: 'Sun', precipitation: 5 },
    ],
  },
  alertingSensors: [
    { sensor: 'Umidade do Solo', value: '15% (Baixo)', level: 'Low' },
    { sensor: 'Bateria do Sensor de pH', value: '10% (Crítico)', level: 'Critical' },
  ],
  cameraImageUrl: 'https://picsum.photos/800/600',
  cameraTimestamp: new Date().toLocaleString(),
  alertsLog: [
    { id: 'al1', message: 'Baixa Umidade Detectada', type: 'Alerta', timestamp: '10:45 AM' },
    { id: 'al2', message: 'Bateria do Sensor Baixa', type: 'Info', timestamp: '09:15 AM' },
    { id: 'al3', message: 'Alta Temperatura Esperada', type: 'Info', timestamp: 'Ontem' },
  ],
  activityProgress: [
    { name: 'Plantio', current: 80, total: 100, unit: 'ha' },
    { name: 'Pulverização', current: 50, total: 100, unit: 'ha' },
    { name: 'Colheita', current: 20, total: 100, unit: 'ha' },
  ],
};

const station2: Property['crops'][0]['stations'][0] = {
  id: 'st2',
  name: 'Estação 02 - Setor Sul',
  location: { lat: -23.5585, lng: -46.6413 },
  sensorData: {
    soilMoisture: { name: 'Umidade do Solo', value: 45, unit: '%', trend: generateTrend(45), icon: Droplets },
    airTemperature: { name: 'Temperatura do Ar', value: 26, unit: '°C', trend: generateTrend(26), icon: Thermometer },
    soilPH: { name: 'pH do Solo', value: 6.5, unit: '', trend: generateTrend(6.5), icon: FlaskConical },
    luminosity: { name: 'Ultravioleta', value: 62000, unit: 'Lux', trend: generateTrend(62000), icon: Sun },
    airHumidity: { name: 'Umidade do Ar', value: 55, unit: '%', trend: generateTrend(55), icon: Droplets },
    windSpeed: { name: 'Velocidade do Vento', value: 12, unit: 'km/h', trend: generateTrend(12), icon: Wind },
    soilTemperature: { name: 'Temperatura do Solo', value: 24, unit: '°C', trend: generateTrend(24), icon: Heater },
    electricalConductivity: { name: 'Condutividade Elétrica', value: 1.5, unit: 'mS/cm', trend: generateTrend(1.5), icon: Zap },
    nitrogen: { name: 'Nitrogênio (N)', value: 140, unit: 'kg/ha', trend: generateTrend(140), icon: Sprout },
    phosphorus: { name: 'Fósforo (P)', value: 90, unit: 'kg/ha', trend: generateTrend(90), icon: Leaf },
    potassium: { name: 'Potássio (K)', value: 160, unit: 'kg/ha', trend: generateTrend(160), icon: Leaf },
    evapotranspiration: { name: 'Precipitação', value: 4.1, unit: 'mm/dia', trend: generateTrend(4.1), icon: CloudDrizzle },
    windDirection: { name: 'Direção do Vento', value: 180, unit: '°', trend: generateTrend(180, 7, 0.2), icon: Navigation },
    windDirectionQuadrant: { name: 'Quadrante do Vento', value: 2, unit: '', trend: generateTrend(2, 7, 0.3), icon: Compass },
    airCO2: { name: 'CO₂ no Ar', value: 420, unit: 'ppm', trend: generateTrend(420), icon: Cloud },
    rainIndicator: { name: 'Indicador de Chuva', value: 0, unit: '', trend: generateTrend(0, 7, 1), icon: CloudRain },
  },
  weatherForecast: {
    twentyFourHours: Array.from({ length: 8 }, (_, i) => ({
      time: `${String(new Date().getHours() + i * 3).padStart(2, '0')}:00`,
      temp: 26 + Math.round((Math.random() - 0.5) * 4),
      icon: Math.random() > 0.8 ? 'CloudRain' : 'Sun',
      precipitation: Math.floor(Math.random() * 20),
    })),
    fiveDays: [
      { day: 'Hoje', maxTemp: 30, minTemp: 20, icon: 'Sun', precipitation: 10 },
      { day: 'Amanhã', maxTemp: 31, minTemp: 21, icon: 'Sun', precipitation: 5 },
      { day: 'Qua', maxTemp: 29, minTemp: 19, icon: 'CloudSun', precipitation: 30 },
      { day: 'Qui', maxTemp: 28, minTemp: 18, icon: 'Cloudy', precipitation: 20 },
      { day: 'Sex', maxTemp: 30, minTemp: 20, icon: 'Sun', precipitation: 0 },
    ],
  },
  alertingSensors: [],
  cameraImageUrl: 'https://picsum.photos/800/601',
  cameraTimestamp: new Date().toLocaleString(),
  alertsLog: [
    { id: 'al4', message: 'Sistema OK', type: 'Info', timestamp: '11:00 AM' },
    { id: 'al5', message: 'Manutenção Agendada', type: 'Info', timestamp: '08:00 AM' },
  ],
  activityProgress: [
    { name: 'Plantio', current: 115, total: 120, unit: 'ha' },
    { name: 'Pulverização', current: 80, total: 120, unit: 'ha' },
    { name: 'Colheita', current: 40, total: 120, unit: 'ha' },
  ],
};

const station3 = { ...station1, id: 'st3', name: 'Estação 03 - Canto Oeste', location: { lat: -23.551, lng: -46.649 } };
const station4 = { ...station2, id: 'st4', name: 'Estação 04 - Canto Leste', location: { lat: -23.559, lng: -46.635 } };
const station5 = { ...station1, id: 'st5', name: 'Estação 05 - Central', location: { lat: -23.554, lng: -46.638 } };
const station6 = { ...station2, id: 'st6', name: 'Estação 06 - Estufa A', location: { lat: -23.549, lng: -46.632 } };
const station7 = { ...station1, id: 'st7', name: 'Estação 07 - Estufa B', location: { lat: -23.548, lng: -46.631 } };
const station8 = { ...station2, id: 'st8', name: 'Estação 08 - Bloco do Pomar', location: { lat: -23.56, lng: -46.645 } };
const station9 = { ...station1, id: 'st9', name: 'Estação 09 - Ponto do Reservatório', location: { lat: -23.545, lng: -46.64 } };
const station10 = { ...station2, id: 'st10', name: 'Estação 10 - Campo Experimental', location: { lat: -23.562, lng: -46.63 } };
const station11 = { ...station1, id: 'st11', name: 'Estação 11 - Pastagem Norte', location: { lat: -23.542, lng: -46.636 } };
const station12 = { ...station2, id: 'st12', name: 'Estação 12 - Pastagem Sul', location: { lat: -23.565, lng: -46.642 } };
const station13 = { ...station1, id: 'st13', name: 'Estação 13 - Área de Irrigação', location: { lat: -23.555, lng: -46.628 } };

export const mockData: Property[] = [
  {
    id: 'prop1',
    name: 'Fazenda Vale Verde',
    location: { lat: -23.5545, lng: -46.6385 },
    mapImageUrl: 'https://picsum.photos/1200/800',
    crops: [
      {
        id: 'crop1',
        name: 'Soja',
        stations: [station1, station2],
      },
      {
        id: 'crop2',
        name: 'Milho',
        stations: [station3, station4],
      },
      {
        id: 'crop3',
        name: 'Trigo',
        stations: [station5],
      },
      {
        id: 'crop4',
        name: 'Cana-de-açúcar',
        stations: [station6, station7],
      },
      {
        id: 'crop5',
        name: 'Algodão',
        stations: [station8, station9],
      },
      {
        id: 'crop7',
        name: 'Feijão',
        stations: [station10],
      },
      {
        id: 'crop8',
        name: 'Girassol',
        stations: [station11, station12],
      },
      {
        id: 'crop9',
        name: 'Sorgo',
        stations: [station13],
      }
    ],
  },
  {
    id: 'prop2',
    name: 'Campos do Sol',
    location: { lat: -22.9068, lng: -43.1729 },
    mapImageUrl: 'https://picsum.photos/1200/801',
    crops: [
      {
        id: 'crop6',
        name: 'Café',
        stations: [station9],
      },
    ],
  },
];
