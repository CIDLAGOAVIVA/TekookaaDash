import type { LucideIcon } from "lucide-react";

export interface SensorMetric {
  value: number;
  unit: string;
  trend: { time: string; value: number }[];
  icon: LucideIcon;
  name: string;
}

export interface SensorData {
  soilMoisture: SensorMetric;
  airTemperature: SensorMetric;
  soilPH: SensorMetric;
  luminosity: SensorMetric;
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
  level: 'Low' | 'High' | 'Critical';
}

export interface LoggedAlert {
  id: string;
  message: string;
  type: 'Alert' | 'Info';
  timestamp: string;
}

export interface Station {
  id: string;
  name: string;
  sensorData: SensorData;
  weatherForecast: WeatherForecast;
  alertingSensors: AlertingSensor[];
  cameraImageUrl: string;
  cameraTimestamp: string;
  alertsLog: LoggedAlert[];
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
}
