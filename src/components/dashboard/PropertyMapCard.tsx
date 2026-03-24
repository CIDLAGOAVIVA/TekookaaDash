'use client';

import dynamic from 'next/dynamic';
import type { FC } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Station, Property } from '@/lib/types';

interface PropertyMapCardProps {
  station: Station;
  property: Property;
}

// Dynamically import MapContent to avoid SSR issues with leaflet
const MapContent = dynamic(() => import('./PropertyMapContent'), {
  ssr: false,
  loading: () => (
    <Card className="rounded-2xl shadow-lg overflow-hidden h-full bg-card text-card-foreground border-none">
      <CardHeader>
        <CardTitle><h2 className="font-headline text-xl">Mapa da Propriedade</h2></CardTitle>
      </CardHeader>
      <div className="aspect-[4/3] flex items-center justify-center bg-muted">
        <p className="text-card-foreground/70">Carregando mapa...</p>
      </div>
    </Card>
  ),
});

const PropertyMapCard: FC<PropertyMapCardProps> = ({ station, property }) => {
  return <MapContent station={station} property={property} />;
};

export default PropertyMapCard;
