"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { mockData } from '@/lib/mock-data';
import type { Property, Crop, Station } from '@/lib/types';
import SensorMetricsCard from './SensorMetricsCard';
import WeatherForecastCard from './WeatherForecastCard';
import AlertingSensorsCard from './AlertingSensorsCard';
import PropertyMapCard from './PropertyMapCard';
import CameraFeedCard from './CameraFeedCard';
import AlertsLogCard from './AlertsLogCard';
import { Tractor } from 'lucide-react';

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
  const [properties] = useState<Property[]>(mockData);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectedProperty = useMemo(() => properties.find(p => p.id === selectedPropertyId), [properties, selectedPropertyId]);
  const availableCrops = useMemo(() => selectedProperty?.crops || [], [selectedProperty]);
  const selectedCrop = useMemo(() => availableCrops.find(c => c.id === selectedCropId), [availableCrops, selectedCropId]);
  const availableStations = useMemo(() => selectedCrop?.stations || [], [selectedCrop]);
  const selectedStationData = useMemo(() => availableStations.find(s => s.id === selectedStationId), [availableStations, selectedStationId]);

  useEffect(() => {
    setSelectedCropId(null);
    setSelectedStationId(null);
  }, [selectedPropertyId]);

  useEffect(() => {
    setSelectedStationId(null);
  }, [selectedCropId]);
  
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
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary mb-2 font-headline">AgriSight Dashboard</h1>
          <p className="text-muted-foreground">Your hub for precision agriculture monitoring.</p>
        </div>

        <Card className="mb-8 rounded-2xl shadow-lg bg-card text-card-foreground border-none">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                <label className="text-sm font-medium text-card-foreground/80 mb-2 block">1. Select Property</label>
                <Select onValueChange={setSelectedPropertyId} value={selectedPropertyId ?? undefined}>
                  <SelectTrigger className="rounded-lg text-base h-12 text-card-foreground">
                    <SelectValue placeholder="Choose a property..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card text-card-foreground">
                    {properties.map(prop => (
                      <SelectItem key={prop.id} value={prop.id}>{prop.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-card-foreground/80 mb-2 block">2. Select Crop</label>
                <Select onValueChange={setSelectedCropId} value={selectedCropId ?? undefined} disabled={!selectedPropertyId}>
                  <SelectTrigger className="rounded-lg text-base h-12 text-card-foreground">
                    <SelectValue placeholder="Choose a crop..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card text-card-foreground">
                    {availableCrops.map(crop => (
                      <SelectItem key={crop.id} value={crop.id}>{crop.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-card-foreground/80 mb-2 block">3. Select Station</label>
                <Select onValueChange={setSelectedStationId} value={selectedStationId ?? undefined} disabled={!selectedCropId}>
                  <SelectTrigger className="rounded-lg text-base h-12 text-card-foreground">
                    <SelectValue placeholder="Choose a monitoring station..." />
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </motion.div>
          ) : selectedStationData ? (
            <motion.div
              key="dashboard"
              variants={gridVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <motion.div variants={cardVariants} className="lg:col-span-4">
                <SensorMetricsCard sensorData={selectedStationData.sensorData} />
              </motion.div>
              <motion.div variants={cardVariants} className="lg:col-span-2">
                <WeatherForecastCard forecast={selectedStationData.weatherForecast} />
              </motion.div>
              <motion.div variants={cardVariants} className="lg:col-span-2">
                <AlertingSensorsCard sensors={selectedStationData.alertingSensors} />
              </motion.div>
               <motion.div variants={cardVariants} className="lg:col-span-2">
                <PropertyMapCard mapImageUrl={selectedProperty?.mapImageUrl ?? ""} stationName={selectedStationData.name} />
              </motion.div>
              <motion.div variants={cardVariants} className="lg:col-span-1">
                 <CameraFeedCard imageUrl={selectedStationData.cameraImageUrl} timestamp={selectedStationData.cameraTimestamp} />
              </motion.div>
              <motion.div variants={cardVariants} className="lg:col-span-1">
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
                    <h2 className="text-2xl font-semibold mb-2">Welcome to AgriSight</h2>
                    <p className="text-card-foreground/80">Please make a selection above to view dashboard data.</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
