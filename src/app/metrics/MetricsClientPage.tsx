'use client';

import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { mockData } from '@/lib/mock-data';
import type { SensorData, SensorMetric, Station } from '@/lib/types';
import { ArrowLeft, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const MetricChartCard: React.FC<{ metric: SensorMetric }> = ({ metric }) => {
  return (
    <Card className="bg-card text-card-foreground border-none rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <metric.icon className="w-6 h-6 text-primary" />
          {metric.name}
        </CardTitle>
        <CardDescription>
          Últimos 7 dias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metric.trend} margin={{ top: 5, right: 20, left: 10, bottom: 20 }}>
              <defs>
                <linearGradient id={`color${metric.name.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
              <XAxis
                dataKey="time"
                stroke="hsl(var(--foreground) / 0.7)"
                tick={{ fill: 'hsl(var(--foreground) / 0.9)' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
              >
                <Label value="Dias" offset={-15} position="insideBottom" fill="hsl(var(--foreground) / 0.9)" />
              </XAxis>
              <YAxis
                stroke="hsl(var(--foreground) / 0.7)"
                unit={metric.unit}
                tick={{ fill: 'hsl(var(--foreground) / 0.9)' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
              >
                <Label value={metric.unit} angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fill: 'hsl(var(--foreground) / 0.9)' }} />
              </YAxis>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  color: 'hsl(var(--card-foreground))',
                  borderRadius: 'var(--radius)'
                }}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#color${metric.name.replace(/\s/g, '')})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Histórico de Dados</h4>
          <div className="max-h-48 overflow-y-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dia</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metric.trend.slice().reverse().map((dataPoint) => (
                  <TableRow key={dataPoint.time}>
                    <TableCell>{dataPoint.time}</TableCell>
                    <TableCell className="text-right">{dataPoint.value} {metric.unit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


export default function MetricsClientPage() {
  const searchParams = useSearchParams();
  const stationId = searchParams.get('stationId');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);

  const stationData = useMemo((): Station | undefined => {
    if (!stationId) return undefined;
    for (const property of mockData) {
      for (const crop of property.crops) {
        const station = crop.stations.find((s) => s.id === stationId);
        if (station) return station;
      }
    }
    return undefined;
  }, [stationId]);

  const metrics = useMemo(() => {
    if (!stationData) return [];
    return Object.values(stationData.sensorData);
  }, [stationData]);

  const filteredMetrics = useMemo(() => {
    if (selectedMetrics.length === 0) return metrics;
    return metrics.filter(metric => selectedMetrics.includes(metric.name));
  }, [metrics, selectedMetrics]);

  const handleMetricToggle = (metricName: string) => {
    setSelectedMetrics(current => {
      if (current.includes(metricName)) {
        return current.filter(name => name !== metricName);
      } else {
        return [...current, metricName];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedMetrics.length === metrics.length) {
      setSelectedMetrics([]);
    } else {
      setSelectedMetrics(metrics.map(metric => metric.name));
    }
  };

  if (!stationData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <h2 className="text-2xl font-semibold mb-4">Estação não encontrada</h2>
        <p className="text-muted-foreground mb-8">Não foi possível carregar os dados da estação solicitada.</p>
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background font-body">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button asChild variant="outline" className="mb-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o Dashboard
            </Link>
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-2 font-headline">Detalhes dos Sensores</h1>
              <p className="text-muted-foreground">Análise histórica para a estação: <span className="font-semibold text-foreground">{stationData.name}</span></p>
            </div>
            <div className="flex items-center gap-2">
              <Popover open={isFilterPopoverOpen} onOpenChange={setIsFilterPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filtrar Sensores
                    {selectedMetrics.length > 0 && (
                      <Badge variant="secondary" className="ml-1">{selectedMetrics.length}</Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Filtrar por tipo de sensor</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSelectAll}
                      >
                        {selectedMetrics.length === metrics.length ? "Desmarcar Todos" : "Selecionar Todos"}
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                      {metrics.map(metric => (
                        <div key={metric.name} className="flex items-center space-x-2">
                          <Checkbox
                            id={`filter-${metric.name}`}
                            checked={selectedMetrics.includes(metric.name) || selectedMetrics.length === 0}
                            onCheckedChange={() => handleMetricToggle(metric.name)}
                          />
                          <label
                            htmlFor={`filter-${metric.name}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                          >
                            <metric.icon className="h-4 w-4 text-primary" />
                            {metric.name}
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        onClick={() => setIsFilterPopoverOpen(false)}
                      >
                        Aplicar
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          {selectedMetrics.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <p className="text-sm text-muted-foreground mr-2 py-1">Filtros ativos:</p>
              {selectedMetrics.map(name => (
                <Badge
                  key={name}
                  variant="outline"
                  className="flex items-center gap-1 py-1"
                  onClick={() => handleMetricToggle(name)}
                >
                  {name}
                  <button className="ml-1 hover:text-destructive">×</button>
                </Badge>
              ))}
              {selectedMetrics.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7 px-2"
                  onClick={() => setSelectedMetrics([])}
                >
                  Limpar filtros
                </Button>
              )}
            </div>
          )}
        </div>

        {filteredMetrics.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredMetrics.map(metric => (
              <MetricChartCard key={metric.name} metric={metric} />
            ))}
          </div>
        ) : (
          <Card className="bg-card text-card-foreground border-none rounded-2xl shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Filter className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum sensor selecionado</h3>
              <p className="text-muted-foreground text-center">
                Selecione pelo menos um sensor no filtro para visualizar seus dados.
              </p>
              <Button
                className="mt-4"
                onClick={() => setSelectedMetrics([])}
              >
                Mostrar Todos os Sensores
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
