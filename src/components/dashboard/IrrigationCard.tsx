"use client";

import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { SensorMetric } from '@/lib/types';
import { getIrrigationRecommendation, type IrrigationInput } from '@/ai/flows/irrigation-flow';

interface IrrigationCardProps {
  soilMoisture: SensorMetric;
  airTemperature: SensorMetric;
  airHumidity: SensorMetric;
  windSpeed: SensorMetric;
  ultravioletIndex: SensorMetric;
  cropType: string;
}

const MetricItem: FC<{ metric: SensorMetric }> = ({ metric }) => {
  const Icon = metric.icon;
  if (!Icon) {
    return null; // Skip if icon is undefined
  }
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 text-card-foreground/80">
        <Icon className="w-4 h-4" />
        <span>{metric.name}</span>
      </div>
      <span className="font-semibold text-card-foreground">
        {metric.value.toLocaleString()} {metric.unit}
      </span>
    </div>
  )
}

const IrrigationCard: FC<IrrigationCardProps> = ({
  soilMoisture,
  airTemperature,
  airHumidity,
  windSpeed,
  ultravioletIndex,
  cropType,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // UV Index pode ser usado como proxy para luminosidade
  const fetchEvapotranspiration = async () => {
    setIsLoading(true);
    try {
      const input: IrrigationInput = {
        soilMoisture: soilMoisture.value,
        airTemperature: airTemperature.value,
        airHumidity: airHumidity.value,
        windSpeed: windSpeed.value,
        luminosity: ultravioletIndex.value, // Usar UV index como proxy
        cropType,
      };

      const result = await getIrrigationRecommendation(input);
      // Resultado da IA pode ser usado para recomendações
      console.log('Irrigação recomendada:', result);
    } catch (error) {
      console.error('Failed to get irrigation recommendation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvapotranspiration();
  }, [
    soilMoisture.value,
    airTemperature.value,
    airHumidity.value,
    windSpeed.value,
    ultravioletIndex.value,
    cropType,
  ]);

  return (
    <Card className="rounded-2xl shadow-lg h-full bg-card text-card-foreground border-none">
      <CardHeader>
        <CardTitle>
          <h2 className="font-headline text-xl">Gestão da Irrigação</h2>
        </CardTitle>
        <CardDescription className="text-card-foreground/70">Monitoramento de métricas para irrigação</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2 p-4 bg-card-foreground/5 rounded-lg">
            <MetricItem metric={soilMoisture} />
            <MetricItem metric={airTemperature} />
            <MetricItem metric={airHumidity} />
            <MetricItem metric={windSpeed} />
            <MetricItem metric={ultravioletIndex} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IrrigationCard;
