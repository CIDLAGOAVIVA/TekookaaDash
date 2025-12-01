import type { LucideIcon } from "lucide-react";

export interface SensorMetric {
  value: number;
  unit: string;
  trend: { time: string; value: number }[];
  icon: LucideIcon;
  name: string;
}

export interface SensorData {
  airTemperature: SensorMetric;
  electricalConductivity: SensorMetric;
  soilPH: SensorMetric;
  nitrogen: SensorMetric;
  phosphorus: SensorMetric;
  potassium: SensorMetric;
  co2: SensorMetric;
  precipitation: SensorMetric;
  rainDetection: SensorMetric;
  soilMoisture: SensorMetric;
  ultravioletIndex: SensorMetric;
  windSpeed: SensorMetric;
  windQuadrant: SensorMetric;
  windDirection: SensorMetric;
  airHumidity: SensorMetric;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  icon: string;
  precipitation: number;
}

export interface DailyForecast {
  day: string;
  maxTemp: number;
  minTemp: number;
  icon: string;
  precipitation: number;
}

export interface WeatherForecast {
  twentyFourHours: HourlyForecast[];
  fiveDays: DailyForecast[];
}

export interface AlertingSensor {
  sensor: string;
  value: string;
  level: 'Baixo' | 'Alto' | 'Crítico' | 'Low' | 'High' | 'Critical';
}

export interface LoggedAlert {
  id: string;
  message: string;
  type: 'Alerta' | 'Info' | 'Alert';
  timestamp: string;
}

export interface ActivityProgress {
  name: string;
  current: number;
  total: number;
  unit: string;
}

export interface Station {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  sensorData: SensorData;
  weatherForecast: WeatherForecast;
  alertingSensors: AlertingSensor[];
  cameraImageUrl: string;
  cameraTimestamp: string;
  alertsLog: LoggedAlert[];
  activityProgress: ActivityProgress[];
}

export interface Crop {
  id: string;
  name: string;
  stations: Station[];
}

export interface Property {
  id: string;
  name: string;
  crops: Crop[];
  mapImageUrl: string;
  location: {
    lat: number;
    lng: number;
  };
}