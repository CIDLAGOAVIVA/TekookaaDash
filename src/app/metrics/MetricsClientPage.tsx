'use client';

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockData } from '@/lib/mock-data';
import type { SensorData, SensorMetric, Station } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';

const MetricChartCard: React.FC<{ metric: SensorMetric }> = ({ metric }) => {
  return (
    <Card className="bg-card text-card-foreground border-none rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
            <metric.icon className="w-6 h-6 text-primary" />
            {metric.name}
        </CardTitle>
        <CardDescription>
            Últimas 24 horas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metric.trend} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <defs>
                        <linearGradient id={`color${metric.name}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                    <XAxis dataKey="time" stroke="hsl(var(--foreground) / 0.7)" />
                    <YAxis stroke="hsl(var(--foreground) / 0.7)" unit={metric.unit} />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                            color: 'hsl(var(--card-foreground))'
                        }}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="hsl(var(--primary))" 
                        fillOpacity={1} 
                        fill={`url(#color${metric.name})`} 
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
                            <TableHead>Horário</TableHead>
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

  const metrics = Object.values(stationData.sensorData);

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
                <h1 className="text-4xl font-bold text-primary mb-2 font-headline">Detalhes dos Sensores</h1>
                <p className="text-muted-foreground">Análise histórica para a estação: <span className="font-semibold text-foreground">{stationData.name}</span></p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {metrics.map(metric => (
                    <MetricChartCard key={metric.name} metric={metric} />
                ))}
            </div>
        </div>
    </main>
  );
}
