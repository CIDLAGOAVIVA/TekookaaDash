"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { useStationMetrics } from '@/hooks/use-station-metrics';
import { useDashboardSettings } from '@/hooks/use-dashboard-settings';
import { useWeatherForecast } from '@/hooks/use-weather-forecast';
import type { Property, Crop, Station } from '@/lib/types';
import SensorMetricsCard from './SensorMetricsCard';
import WeatherForecastCard from './WeatherForecastCard';
import AlertingSensorsCard from './AlertingSensorsCard';
import PropertyMapCard from './PropertyMapCard';
import CameraFeedCard from './CameraFeedCard';
import AlertsLogCard from './AlertsLogCard';
import ActivityProgressCard from './ActivityProgressCard';
import { Tractor, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import IrrigationCard from './IrrigationCard';

const SkeletonCard = () => (
  <Card className="rounded-2xl">
    <CardHeader>
      <Skeleton className="h-6 w-3/5" />
      <Skeleton className="h-4 w-4/5" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-24 w-full" />
    </CardContent>
  </Card>
);

export default function DashboardClient() {
  const { properties, loading, error } = useDashboardData();
  const { settings, isLoaded: settingsLoaded, saveSettings } = useDashboardSettings();
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Carregar métricas da estação selecionada com configurações de histórico
  const { sensorData: stationMetrics, loading: metricsLoading } = useStationMetrics(
    selectedStationId,
    {
      refetchInterval: settings.pollingIntervalSeconds * 1000,
      historyMinutes: settings.historyIntervalMinutes,
    }
  );

  // Carregar previsão do tempo da estação selecionada
  const { forecast: weatherForecast, loading: weatherLoading } = useWeatherForecast(selectedStationId);

  const selectedProperty = useMemo(() => properties.find(p => p.id === selectedPropertyId), [properties, selectedPropertyId]);
  const availableCrops = useMemo(() => selectedProperty?.crops || [], [selectedProperty]);
  const selectedCrop = useMemo(() => availableCrops.find(c => c.id === selectedCropId), [availableCrops, selectedCropId]);
  const availableStations = useMemo(() => selectedCrop?.stations || [], [selectedCrop]);
  const selectedStationData = useMemo(() => availableStations.find(s => s.id === selectedStationId), [availableStations, selectedStationId]);

  useEffect(() => {
    if (properties.length > 0) {
      setSelectedPropertyId(properties[0].id);
    }
  }, [properties]);

  useEffect(() => {
    if (availableCrops.length > 0) {
      setSelectedCropId(availableCrops[0].id);
    } else {
      setSelectedCropId(null);
    }
    setSelectedStationId(null);
  }, [selectedPropertyId, availableCrops]);

  useEffect(() => {
    if (availableStations.length > 0) {
      setSelectedStationId(availableStations[0].id);
    } else {
      setSelectedStationId(null);
    }
  }, [selectedCropId, availableStations]);

  useEffect(() => {
    if (selectedStationId) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [selectedStationId]);

  const gridVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <main className="min-h-screen bg-background font-body">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div className="text-left">
            <h1 className="text-4xl font-bold text-primary mb-2 font-headline">AgroDash</h1>
            <p className="text-muted-foreground">Semeando dados e colhendo eficiência</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/login">
              <User className="mr-2 h-4 w-4" />
              Login do Admin
            </Link>
          </Button>
        </div>

        <Card className="mb-8 rounded-2xl shadow-lg bg-card text-card-foreground border-none">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                <label className="text-sm font-medium text-card-foreground/80 mb-2 block">1. Selecione a Propriedade</label>
                <Select onValueChange={setSelectedPropertyId} value={selectedPropertyId ?? undefined}>
                  <SelectTrigger className="rounded-lg text-base h-12 bg-white text-black">
                    <SelectValue placeholder="Escolha uma propriedade..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card text-card-foreground">
                    {properties.map(prop => (
                      <SelectItem key={prop.id} value={prop.id}>{prop.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-card-foreground/80 mb-2 block">2. Selecione a Cultura</label>
                <Select onValueChange={setSelectedCropId} value={selectedCropId ?? undefined} disabled={!selectedPropertyId}>
                  <SelectTrigger className="rounded-lg text-base h-12 bg-white text-black">
                    <SelectValue placeholder="Escolha uma cultura..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card text-card-foreground">
                    {availableCrops.map(crop => (
                      <SelectItem key={crop.id} value={crop.id}>{crop.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-card-foreground/80 mb-2 block">3. Selecione a Estação</label>
                <Select onValueChange={setSelectedStationId} value={selectedStationId ?? undefined} disabled={!selectedCropId}>
                  <SelectTrigger className="rounded-lg text-base h-12 bg-white text-black">
                    <SelectValue placeholder="Escolha uma estação..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card text-card-foreground">
                    {availableStations.map(station => (
                      <SelectItem key={station.id} value={station.id}>{station.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </motion.div>
          ) : selectedStationData ? (
            <motion.div
              key="dashboard"
              variants={gridVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2"
            >
              <motion.div variants={cardVariants} className="lg:col-span-4">
                <Link href={`/metrics?stationId=${selectedStationId}`}>
                  <SensorMetricsCard 
                    sensorData={{ ...selectedStationData.sensorData, ...stationMetrics }} 
                    currentPeriod={settings.historyIntervalMinutes}
                    onPeriodChange={(minutes) => {
                      saveSettings({ historyIntervalMinutes: minutes });
                    }}
                  />
                </Link>
              </motion.div>
              <motion.div variants={cardVariants} className="lg:col-span-2">
                <WeatherForecastCard forecast={weatherForecast.twentyFourHours.length > 0 ? weatherForecast : selectedStationData.weatherForecast} />
              </motion.div>
              <motion.div variants={cardVariants} className="lg:col-span-2">
                <AlertingSensorsCard sensors={selectedStationData.alertingSensors} />
              </motion.div>
              <motion.div variants={cardVariants} className="lg:col-span-2">
                <PropertyMapCard
                  station={selectedStationData}
                  property={selectedProperty!}
                />
              </motion.div>
              <motion.div variants={cardVariants} className="lg:col-span-1">
                <IrrigationCard
                  soilMoisture={selectedStationData.sensorData.soilMoisture}
                  airTemperature={selectedStationData.sensorData.airTemperature}
                  airHumidity={selectedStationData.sensorData.airHumidity}
                  windSpeed={selectedStationData.sensorData.windSpeed}
                  ultravioletIndex={selectedStationData.sensorData.ultravioletIndex}
                  cropType={selectedCrop!.name}
                />
              </motion.div>
              <motion.div variants={cardVariants} className="lg:col-span-1">
                <ActivityProgressCard activities={selectedStationData.activityProgress} />
              </motion.div>
              <motion.div variants={cardVariants} className="lg:col-span-4">
                <CameraFeedCard imageUrl={selectedStationData.cameraImageUrl} timestamp={selectedStationData.cameraTimestamp} />
              </motion.div>
              <motion.div variants={cardVariants} className="lg:col-span-4">
                <AlertsLogCard alerts={selectedStationData.alertsLog} />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="prompt"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <Card className="max-w-md mx-auto rounded-2xl shadow-lg bg-card text-card-foreground border-none">
                <CardContent className="p-8 flex flex-col items-center">
                  <Tractor className="w-16 h-16 text-primary mb-4" />
                  <h2 className="text-2xl font-semibold mb-2">Bem-vindo ao AgroDash</h2>
                  <p className="text-card-foreground/80">Por favor, faça uma seleção acima para visualizar os dados do painel.</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
