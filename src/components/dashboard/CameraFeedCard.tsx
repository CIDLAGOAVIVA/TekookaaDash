"use client";

import type { FC } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface CameraFeedCardProps {
  imageUrl: string;
  timestamp: string;
}

const CameraFeedCard: FC<CameraFeedCardProps> = ({ imageUrl, timestamp }) => {
  return (
    <Card className="rounded-2xl shadow-lg overflow-hidden h-full bg-card text-card-foreground border-none">
      <CardHeader>
        <CardTitle><h2 className="font-headline text-xl">Monitoring Camera</h2></CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="aspect-[4/3] relative">
          <Image
            src={imageUrl}
            alt="Monitoring Camera Feed"
            fill
            className="object-cover"
            data-ai-hint="field crop"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4 bg-card-foreground/5">
            <p className="text-xs text-center text-card-foreground/70">Last capture: {timestamp}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraFeedCard;
