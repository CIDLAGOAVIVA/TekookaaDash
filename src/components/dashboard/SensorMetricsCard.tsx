"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { SensorData, SensorMetric } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Activity, Clock, CloudRain, CloudDrizzle, CloudLightning, Sun, Cloud } from 'lucide-react';
import { interpretRainSensor, type RainLevel } from '@/lib/rain-detection';

interface MiniChartProps {
  data: { time: string; value: number }[];
  unit?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: { time: string; value: number };
  }>;
  unit?: string;
}

const CustomTooltip: FC<CustomTooltipProps> = ({ active, payload, unit }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-background border border-border/50 rounded-lg px-3 py-2 shadow-xl text-xs">
        <p className="font-semibold text-foreground">
          {data.value.toLocaleString('pt-BR')}{unit ? ` ${unit}` : ''}
        </p>
        <p className="text-muted-foreground">
          {data.payload.time}
        </p>
      </div>
    );
  }
  return null;
};

const MiniChart: FC<MiniChartProps> = ({ data, unit }) => {
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
          <ChartTooltip 
            cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }} 
            content={<CustomTooltip unit={unit} />} 
          />
          <Area dataKey="value" type="monotone" fill="url(#chartGradient)" stroke="hsl(var(--primary))" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

const MetricDisplay: FC<{ metric: SensorMetric | undefined }> = ({ metric }) => {
  if (!metric) {
    return null;
  }
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
        <MiniChart data={metric.trend} unit={metric.unit} />
      </div>
    </div>
  );
}

/** Componente especial para exibição da detecção de chuva com valor qualitativo */
const RainDetectionDisplay: FC<{ metric: SensorMetric | undefined }> = ({ metric }) => {
  if (!metric) {
    return null;
  }
  
  const rainInterpretation = interpretRainSensor(metric.value);
  
  // Mapear o nível de chuva para o ícone apropriado
  const getRainIcon = (level: RainLevel['level']) => {
    switch (level) {
      case 'dry':
        return Sun;
      case 'mist':
        return Cloud;
      case 'light':
        return CloudDrizzle;
      case 'moderate':
        return CloudRain;
      case 'heavy':
        return CloudRain;
      case 'intense':
        return CloudLightning;
      default:
        return Cloud;
    }
  };
  
  const RainIcon = getRainIcon(rainInterpretation.level);
  
  // Cores do fundo baseadas no nível
  const getBgColor = (level: RainLevel['level']) => {
    switch (level) {
      case 'dry':
        return 'bg-green-500/10';
      case 'mist':
        return 'bg-blue-300/10';
      case 'light':
        return 'bg-blue-400/10';
      case 'moderate':
        return 'bg-blue-500/10';
      case 'heavy':
        return 'bg-blue-600/10';
      case 'intense':
        return 'bg-blue-700/10';
      default:
        return 'bg-card-foreground/5';
    }
  };
  
  return (
    <div className={cn(
      "flex flex-col justify-between p-4 rounded-lg h-full transition-colors",
      getBgColor(rainInterpretation.level)
    )}>
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-card-foreground/80">{metric.name}</span>
          <RainIcon className={cn("w-5 h-5", rainInterpretation.color)} />
        </div>
        <div className={cn("text-2xl font-bold", rainInterpretation.color)}>
          {rainInterpretation.label}
        </div>
        <div className="text-xs text-card-foreground/60 mt-1">
          {rainInterpretation.description}
        </div>
      </div>
      <div className="mt-2">
        <MiniChart data={metric.trend} unit="" />
      </div>
    </div>
  );
}

/** Opções de período de tempo em minutos */
export const TIME_PERIOD_OPTIONS = [
  { value: '60', label: '1 hora' },
  { value: '120', label: '2 horas' },
  { value: '240', label: '4 horas' },
  { value: '480', label: '8 horas' },
  { value: '720', label: '12 horas' },
  { value: '1440', label: '24 horas' },
];

interface SensorMetricsCardProps {
  sensorData: SensorData;
  /** Período de tempo atual em minutos */
  currentPeriod?: number;
  /** Callback quando o período de tempo é alterado */
  onPeriodChange?: (minutes: number) => void;
}

const SensorMetricsCard: FC<SensorMetricsCardProps> = ({ 
  sensorData, 
  currentPeriod = 480, 
  onPeriodChange 
}) => {
  const [lastUpdate, setLastUpdate] = useState<string>('agora');
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Mostrar indicador de atualização em tempo real
    const timer = setInterval(() => {
      setLastUpdate(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handlePeriodChange = (value: string) => {
    const minutes = parseInt(value);
    if (onPeriodChange && !isNaN(minutes)) {
      onPeriodChange(minutes);
    }
  };

  return (
    <Card className="rounded-2xl shadow-lg h-full bg-card text-card-foreground border-none transition-all duration-200 hover:shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle><h2 className="font-headline text-xl">Métricas Atuais dos Sensores</h2></CardTitle>
          <div className="flex items-center gap-4 text-sm">
            {onPeriodChange && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <Select 
                  value={String(currentPeriod)} 
                  onValueChange={handlePeriodChange}
                >
                  <SelectTrigger className="w-[130px] h-8 text-xs bg-background/50">
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_PERIOD_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
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
          <RainDetectionDisplay metric={sensorData.rainDetection} />
          <MetricDisplay metric={sensorData.ultravioletIndex} />
        </div>
      </CardContent>
    </Card>
  );
};

export default SensorMetricsCard;
