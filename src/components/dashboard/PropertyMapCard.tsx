"use client";

import type { FC } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface PropertyMapCardProps {
  mapImageUrl: string;
  stationName: string;
}

const PropertyMapCard: FC<PropertyMapCardProps> = ({ mapImageUrl, stationName }) => {
  return (
    <Card className="rounded-2xl shadow-lg overflow-hidden h-full bg-card text-card-foreground border-none">
      <CardHeader>
        <CardTitle><h2 className="font-headline text-xl">Property Map</h2></CardTitle>
        <CardDescription className="text-card-foreground/70">Selected station: <span className="font-semibold text-primary">{stationName}</span></CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="aspect-[4/3] relative">
          <Image
            src={mapImageUrl}
            alt="Property Map"
            fill
            className="object-cover"
            data-ai-hint="farm map pins"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyMapCard;
