"use client";

import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Droplets, Thermometer, BrainCircuit, Wind, Sun, CloudDrizzle } from 'lucide-react';
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
  evapotranspiration?: SensorMetric;
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
  cropType,
  evapotranspiration,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Create a dynamic evapotranspiration metric that can update with calculated values
  const [etMetric, setEtMetric] = useState<SensorMetric>({
    name: 'Evapotranspiração',
    value: evapotranspiration?.value || 0,
    unit: 'mm/dia',
    trend: evapotranspiration?.trend || { direction: 'neutral', percentage: 0 },
    icon: CloudDrizzle,
  });

  const fetchEvapotranspiration = async () => {
    setIsLoading(true);
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

      // Update with calculated ET value
      if (result.calculatedET) {
        // Update the ET metric with the calculated value
        setEtMetric(prevMetric => ({
          ...prevMetric,
          value: result.calculatedET
        }));
      }
    } catch (error) {
      console.error('Failed to get evapotranspiration calculation:', error);
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
    luminosity.value,
    cropType,
    // Only include evapotranspiration value if it exists
    evapotranspiration?.value
  ]);

  // Update ET metric when evapotranspiration prop changes
  useEffect(() => {
    if (evapotranspiration) {
      setEtMetric(prevMetric => ({
        ...prevMetric,
        value: evapotranspiration.value,
        trend: evapotranspiration.trend
      }));
    }
  }, [evapotranspiration]);

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
            <MetricItem metric={luminosity} />
            {isLoading ? (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-card-foreground/80">
                  <CloudDrizzle className="w-4 h-4" />
                  <span>Evapotranspiração</span>
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ) : (
              <MetricItem metric={etMetric} />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IrrigationCard;
