"use client";

import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Droplets, Thermometer, BrainCircuit, Wind, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { SensorMetric } from '@/lib/types';
import { getIrrigationRecommendation, type IrrigationInput } from '@/ai/flows/irrigation-flow';

interface IrrigationCardProps {
  soilMoisture: SensorMetric;
  airTemperature: SensorMetric;
  airHumidity: SensorMetric;
  windSpeed: SensorMetric;
  luminosity: SensorMetric;
  cropType: string;
}

const MetricItem: FC<{ metric: SensorMetric }> = ({ metric }) => {
    const Icon = metric.icon;
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
  luminosity,
  cropType 
}) => {
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecommendation = async () => {
    setIsLoading(true);
    setRecommendation(null);
    try {
      const input: IrrigationInput = {
        soilMoisture: soilMoisture.value,
        airTemperature: airTemperature.value,
        airHumidity: airHumidity.value,
        windSpeed: windSpeed.value,
        luminosity: luminosity.value,
        cropType,
      };
      const result = await getIrrigationRecommendation(input);
      setRecommendation(result.recommendation);
    } catch (error) {
      console.error('Failed to get irrigation recommendation:', error);
      setRecommendation('Não foi possível obter uma recomendação no momento.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendation();
  }, [soilMoisture.value, airTemperature.value, airHumidity.value, windSpeed.value, luminosity.value, cropType]);

  return (
    <Card className="rounded-2xl shadow-lg h-full bg-card text-card-foreground border-none">
      <CardHeader>
        <CardTitle>
          <h2 className="font-headline text-xl">Gestão da Irrigação</h2>
        </CardTitle>
        <CardDescription className="text-card-foreground/70">Recomendação de irrigação baseada em IA.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            <div className="space-y-2 p-4 bg-card-foreground/5 rounded-lg">
                <MetricItem metric={soilMoisture} />
                <MetricItem metric={airTemperature} />
                <MetricItem metric={airHumidity} />
                <MetricItem metric={windSpeed} />
                <MetricItem metric={luminosity} />
            </div>
          
          <div className="p-4 bg-primary/10 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="bg-primary p-2 rounded-full">
                <BrainCircuit className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-primary mb-1">Análise da IA</h3>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : (
                  <p className="text-sm text-card-foreground/90">{recommendation}</p>
                )}
              </div>
            </div>
          </div>
          <Button onClick={fetchRecommendation} disabled={isLoading} variant="outline" className="w-full">
            {isLoading ? 'Analisando...' : 'Analisar Novamente'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IrrigationCard;
