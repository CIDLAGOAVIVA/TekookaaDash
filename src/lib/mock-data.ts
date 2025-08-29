import type { Property } from '@/lib/types';
import { Thermometer, Droplets, FlaskConical, Sun, Wind, Leaf, Zap, Heater,Sprout } from 'lucide-react';

const generateTrend = (base: number, points = 12, fluctuation = 0.1) => {
  return Array.from({ length: points }, (_, i) => ({
    time: `${String(i * 2).padStart(2, '0')}:00`,
    value: parseFloat((base + (Math.random() - 0.5) * (base * fluctuation)).toFixed(1)),
  }));
};

const station1: Property['crops'][0]['stations'][0] = {
  id: 'st1',
  name: 'Station 01 - North Sector',
  sensorData: {
    soilMoisture: { name: 'Soil Moisture', value: 35, unit: '%', trend: generateTrend(35), icon: Droplets },
    airTemperature: { name: 'Air Temperature', value: 24, unit: '°C', trend: generateTrend(24), icon: Thermometer },
    soilPH: { name: 'Soil pH', value: 6.8, unit: '', trend: generateTrend(6.8), icon: FlaskConical },
    luminosity: { name: 'Luminosity', value: 55000, unit: 'Lux', trend: generateTrend(55000), icon: Sun },
    airHumidity: { name: 'Air Humidity', value: 60, unit: '%', trend: generateTrend(60), icon: Droplets },
    windSpeed: { name: 'Wind Speed', value: 15, unit: 'km/h', trend: generateTrend(15), icon: Wind },
    soilTemperature: { name: 'Soil Temperature', value: 22, unit: '°C', trend: generateTrend(22), icon: Heater },
    electricalConductivity: { name: 'EC', value: 1.2, unit: 'mS/cm', trend: generateTrend(1.2), icon: Zap },
    nitrogen: { name: 'Nitrogen (N)', value: 120, unit: 'kg/ha', trend: generateTrend(120), icon: Sprout },
    phosphorus: { name: 'Phosphorus (P)', value: 80, unit: 'kg/ha', trend: generateTrend(80), icon: Leaf },
    potassium: { name: 'Potassium (K)', value: 150, unit: 'kg/ha', trend: generateTrend(150), icon: Leaf },
  },
  weatherForecast: {
    twentyFourHours: Array.from({ length: 8 }, (_, i) => ({
      time: `${String(new Date().getHours() + i * 3).padStart(2, '0')}:00`,
      temp: 24 + Math.round((Math.random() - 0.5) * 5),
      icon: Math.random() > 0.7 ? 'CloudRain' : 'CloudSun',
      precipitation: Math.floor(Math.random() * 40),
    })),
    fiveDays: [
      { day: 'Today', maxTemp: 28, minTemp: 18, icon: 'CloudSun', precipitation: 20 },
      { day: 'Tomorrow', maxTemp: 29, minTemp: 19, icon: 'Sun', precipitation: 10 },
      { day: 'Wed', maxTemp: 27, minTemp: 17, icon: 'CloudRain', precipitation: 60 },
      { day: 'Thu', maxTemp: 26, minTemp: 16, icon: 'Cloudy', precipitation: 40 },
      { day: 'Fri', maxTemp: 28, minTemp: 18, icon: 'Sun', precipitation: 5 },
    ],
  },
  alertingSensors: [
    { sensor: 'Soil Moisture', value: '15% (Low)', level: 'Low' },
    { sensor: 'pH Sensor Battery', value: '10% (Critical)', level: 'Critical' },
  ],
  cameraImageUrl: 'https://picsum.photos/800/600',
  cameraTimestamp: new Date().toLocaleString(),
  alertsLog: [
    { id: 'al1', message: 'Low Moisture Detected', type: 'Alert', timestamp: '10:45 AM' },
    { id: 'al2', message: 'Sensor Battery Low', type: 'Info', timestamp: '09:15 AM' },
    { id: 'al3', message: 'High Temperature Expected', type: 'Info', timestamp: 'Yesterday' },
  ],
};

const station2: Property['crops'][0]['stations'][0] = {
  id: 'st2',
  name: 'Station 02 - South Sector',
  sensorData: {
    soilMoisture: { name: 'Soil Moisture', value: 45, unit: '%', trend: generateTrend(45), icon: Droplets },
    airTemperature: { name: 'Air Temperature', value: 26, unit: '°C', trend: generateTrend(26), icon: Thermometer },
    soilPH: { name: 'Soil pH', value: 6.5, unit: '', trend: generateTrend(6.5), icon: FlaskConical },
    luminosity: { name: 'Luminosity', value: 62000, unit: 'Lux', trend: generateTrend(62000), icon: Sun },
    airHumidity: { name: 'Air Humidity', value: 55, unit: '%', trend: generateTrend(55), icon: Droplets },
    windSpeed: { name: 'Wind Speed', value: 12, unit: 'km/h', trend: generateTrend(12), icon: Wind },
    soilTemperature: { name: 'Soil Temperature', value: 24, unit: '°C', trend: generateTrend(24), icon: Heater },
    electricalConductivity: { name: 'EC', value: 1.5, unit: 'mS/cm', trend: generateTrend(1.5), icon: Zap },
    nitrogen: { name: 'Nitrogen (N)', value: 140, unit: 'kg/ha', trend: generateTrend(140), icon: Sprout },
    phosphorus: { name: 'Phosphorus (P)', value: 90, unit: 'kg/ha', trend: generateTrend(90), icon: Leaf },
    potassium: { name: 'Potassium (K)', value: 160, unit: 'kg/ha', trend: generateTrend(160), icon: Leaf },
  },
  weatherForecast: {
    twentyFourHours: Array.from({ length: 8 }, (_, i) => ({
      time: `${String(new Date().getHours() + i * 3).padStart(2, '0')}:00`,
      temp: 26 + Math.round((Math.random() - 0.5) * 4),
      icon: Math.random() > 0.8 ? 'CloudRain' : 'Sun',
      precipitation: Math.floor(Math.random() * 20),
    })),
    fiveDays: [
      { day: 'Today', maxTemp: 30, minTemp: 20, icon: 'Sun', precipitation: 10 },
      { day: 'Tomorrow', maxTemp: 31, minTemp: 21, icon: 'Sun', precipitation: 5 },
      { day: 'Wed', maxTemp: 29, minTemp: 19, icon: 'CloudSun', precipitation: 30 },
      { day: 'Thu', maxTemp: 28, minTemp: 18, icon: 'Cloudy', precipitation: 20 },
      { day: 'Fri', maxTemp: 30, minTemp: 20, icon: 'Sun', precipitation: 0 },
    ],
  },
  alertingSensors: [],
  cameraImageUrl: 'https://picsum.photos/800/601',
  cameraTimestamp: new Date().toLocaleString(),
  alertsLog: [
    { id: 'al4', message: 'System OK', type: 'Info', timestamp: '11:00 AM' },
    { id: 'al5', message: 'Scheduled Maintenance', type: 'Info', timestamp: '08:00 AM' },
  ],
};

const station3 = { ...station1, id: 'st3', name: 'Station 03 - West Corner' };
const station4 = { ...station2, id: 'st4', name: 'Station 04 - East Corner' };
const station5 = { ...station1, id: 'st5', name: 'Station 05 - Central Hub' };
const station6 = { ...station2, id: 'st6', name: 'Station 06 - Greenhouse A' };
const station7 = { ...station1, id: 'st7', name: 'Station 07 - Greenhouse B' };
const station8 = { ...station2, id: 'st8', name: 'Station 08 - Orchard Block' };
const station9 = { ...station1, id: 'st9', name: 'Station 09 - Reservoir Point' };

export const mockData: Property[] = [
  {
    id: 'prop1',
    name: 'Green Valley Farm',
    mapImageUrl: 'https://picsum.photos/1200/800',
    crops: [
      {
        id: 'crop1',
        name: 'Soy',
        stations: [station1, station2],
      },
      {
        id: 'crop2',
        name: 'Corn',
        stations: [station3, station4],
      },
      {
        id: 'crop3',
        name: 'Wheat',
        stations: [station5],
      },
      {
        id: 'crop4',
        name: 'Sugarcane',
        stations: [station6, station7],
      },
      {
        id: 'crop5',
        name: 'Cotton',
        stations: [station8],
      },
    ],
  },
  {
    id: 'prop2',
    name: 'Sunshine Acres',
    mapImageUrl: 'https://picsum.photos/1200/801',
    crops: [
      {
        id: 'crop6',
        name: 'Coffee',
        stations: [station9],
      },
    ],
  },
];
