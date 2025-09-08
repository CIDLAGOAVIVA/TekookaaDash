"use client";

import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Droplets, Thermometer, BrainCircuit } from 'lucide-react';
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
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-card-foreground/5 rounded-lg">
              <Droplets className="w-6 h-6 mx-auto text-primary mb-2" />
              <p className="text-sm text-card-foreground/80">Umidade do Solo</p>
              <p className="text-2xl font-bold">{soilMoisture.value}<span className="text-lg font-medium">{soilMoisture.unit}</span></p>
            </div>
            <div className="p-4 bg-card-foreground/5 rounded-lg">
              <Thermometer className="w-6 h-6 mx-auto text-primary mb-2" />
              <p className="text-sm text-card-foreground/80">Temp. do Ar</p>
              <p className="text-2xl font-bold">{airTemperature.value}<span className="text-lg font-medium">{airTemperature.unit}</span></p>
            </div>
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
