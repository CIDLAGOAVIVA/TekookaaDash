'use client';

import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import L from 'leaflet';
import type { Station, Property } from '@/lib/types';
import 'leaflet/dist/leaflet.css';

interface PropertyMapContentProps {
  station: Station;
  property: Property;
}

// Fix default marker icon in Next.js
const markerIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const PropertyMapContent: FC<PropertyMapContentProps> = ({ station, property }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [isClient, setIsClient] = useState(false);

  const location = station?.location || property?.location;

  // Fallback para coordenadas padrão (Brasil) se não houver dados
  const DEFAULT_LAT = -15.8;
  const DEFAULT_LNG = -48.0;

  const lat = location?.lat || DEFAULT_LAT;
  const lng = location?.lng || DEFAULT_LNG;

  const coordinates: [number, number] = [lat, lng];
  const hasValidCoordinates = location?.lat && location?.lng;

  // Ensure we only render on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isClient || !containerRef.current) return;

    // Clean up existing map
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    try {
      // Create new map instance
      const map = L.map(containerRef.current, {
        center: coordinates,
        zoom: 15,
        scrollWheelZoom: true,
      });

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add marker
      L.marker(coordinates, { icon: markerIcon })
        .bindPopup(`<strong>${station.name}</strong>${!hasValidCoordinates ? '<br/>(coordenadas não configuradas)' : ''}`)
        .addTo(map);

      mapRef.current = map;
    } catch (error) {
      console.error('Erro ao inicializar mapa:', error);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isClient, coordinates[0], coordinates[1], station.name, hasValidCoordinates]);

  if (!isClient) {
    return (
      <Card className="rounded-2xl shadow-lg overflow-hidden h-full bg-card text-card-foreground border-none">
        <CardHeader>
          <CardTitle><h2 className="font-headline text-xl">Mapa da Propriedade</h2></CardTitle>
        </CardHeader>
        <div className="aspect-[4/3] flex items-center justify-center bg-muted">
          <p className="text-card-foreground/70">Carregando mapa...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl shadow-lg overflow-hidden h-full bg-card text-card-foreground border-none">
      <CardHeader>
        <CardTitle><h2 className="font-headline text-xl">Mapa da Propriedade</h2></CardTitle>
        <CardDescription className="text-card-foreground/70">
          Estação selecionada: <span className="font-semibold text-primary">{station.name}</span>
          {!hasValidCoordinates && <span className="text-xs block mt-1 text-card-foreground/50">(usando localização padrão)</span>}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="aspect-[4/3] relative overflow-hidden rounded-lg" ref={containerRef} style={{ height: '100%' }} />
      </CardContent>
    </Card>
  );
};

export default PropertyMapContent;
