"use client";

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import type { Station, Property } from '@/lib/types';

interface PropertyMapCardProps {
  station: Station;
  property: Property;
}

const PropertyMapCard: FC<PropertyMapCardProps> = ({ station, property }) => {
  const position = station?.location || property?.location;

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
        <Card className="rounded-2xl shadow-lg overflow-hidden h-full bg-card text-card-foreground border-none">
            <CardHeader>
                <CardTitle><h2 className="font-headline text-xl">Mapa da Propriedade</h2></CardTitle>
                <CardDescription className="text-card-foreground/70">Estação selecionada: <span className="font-semibold text-primary">{station.name}</span></CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-full flex items-center justify-center">
                    <p className="text-center text-card-foreground/70">
                        A chave de API do Google Maps não está configurada.<br /> 
                        Adicione NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ao seu arquivo .env.local
                    </p>
                </div>
            </CardContent>
        </Card>
    )
  }

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
        <Card className="rounded-2xl shadow-lg overflow-hidden h-full bg-card text-card-foreground border-none">
        <CardHeader>
            <CardTitle><h2 className="font-headline text-xl">Mapa da Propriedade</h2></CardTitle>
            <CardDescription className="text-card-foreground/70">Estação selecionada: <span className="font-semibold text-primary">{station.name}</span></CardDescription>
        </CardHeader>
        <CardContent className="p-0">
            <div className="aspect-[4/3] relative">
                <Map
                    mapId="agrodash-map"
                    zoom={15}
                    center={position}
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}
                    mapTypeId='satellite'
                >
                    <AdvancedMarker position={position} />
                </Map>
            </div>
        </CardContent>
        </Card>
    </APIProvider>
  );
};

export default PropertyMapCard;
