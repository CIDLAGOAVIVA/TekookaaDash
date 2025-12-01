"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import type { SensorData, SensorMetric } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Activity } from 'lucide-react';

interface MiniChartProps {
  data: { time: string; value: number }[];
}

const MiniChart: FC<MiniChartProps> = ({ data }) => {
  const chartConfig = {
    value: {
      label: 'Valor',
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-10 w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator hideLabel />} />
          <Area dataKey="value" type="monotone" fill="url(#chartGradient)" stroke="hsl(var(--primary))" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

const MetricDisplay: FC<{ metric: SensorMetric }> = ({ metric }) => {
  const Icon = metric.icon;
  if (!Icon) {
    return null; // Skip rendering if icon is undefined
  }
  return (
    <div className="flex flex-col justify-between p-4 bg-card-foreground/5 rounded-lg h-full">
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-card-foreground/80">{metric.name}</span>
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="text-2xl font-bold text-card-foreground">
          {metric.value.toLocaleString()}
          <span className="text-base font-medium text-card-foreground/60 ml-1">{metric.unit}</span>
        </div>
      </div>
      <div className="mt-2">
        <MiniChart data={metric.trend} />
      </div>
    </div>
  );
}

interface SensorMetricsCardProps {
  sensorData: SensorData;
}

const SensorMetricsCard: FC<SensorMetricsCardProps> = ({ sensorData }) => {
  const [lastUpdate, setLastUpdate] = useState<string>('agora');
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Mostrar indicador de atualização em tempo real
    const timer = setInterval(() => {
      setLastUpdate(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="rounded-2xl shadow-lg h-full bg-card text-card-foreground border-none transition-all duration-200 hover:shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle><h2 className="font-headline text-xl">Métricas Atuais dos Sensores</h2></CardTitle>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <Activity className="w-4 h-4 text-green-500 animate-pulse" />
              <span className="text-card-foreground/60">Em tempo real</span>
            </div>
            <span className="text-card-foreground/40 text-xs">{lastUpdate}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <MetricDisplay metric={sensorData.airTemperature} />
          <MetricDisplay metric={sensorData.airHumidity} />
          <MetricDisplay metric={sensorData.soilMoisture} />
          <MetricDisplay metric={sensorData.soilPH} />
          <MetricDisplay metric={sensorData.electricalConductivity} />
          <MetricDisplay metric={sensorData.nitrogen} />
          <MetricDisplay metric={sensorData.phosphorus} />
          <MetricDisplay metric={sensorData.potassium} />
          <MetricDisplay metric={sensorData.co2} />
          <MetricDisplay metric={sensorData.windSpeed} />
          <MetricDisplay metric={sensorData.windDirection} />
          <MetricDisplay metric={sensorData.windQuadrant} />
          <MetricDisplay metric={sensorData.precipitation} />
          <MetricDisplay metric={sensorData.rainDetection} />
          <MetricDisplay metric={sensorData.ultravioletIndex} />
        </div>
      </CardContent>
    </Card>
  );
};

export default SensorMetricsCard;
