"use client";

import type { FC } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface CameraFeedCardProps {
  imageUrl: string;
  timestamp: string;
}

const CameraFeedCard: FC<CameraFeedCardProps> = ({ imageUrl, timestamp }) => {
  // Se não houver imagem, mostrar placeholder
  if (!imageUrl) {
    return (
      <Card className="rounded-2xl shadow-lg overflow-hidden h-full bg-card text-card-foreground border-none">
        <CardHeader>
          <CardTitle><h2 className="font-headline text-xl">Câmera de Monitoramento</h2></CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="aspect-[4/3] relative bg-card-foreground/10 flex items-center justify-center">
            <p className="text-card-foreground/60">Sem feed disponível</p>
          </div>
          <div className="p-4 bg-card-foreground/5">
            <p className="text-xs text-center text-card-foreground/70">Câmera indisponível</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl shadow-lg overflow-hidden h-full bg-card text-card-foreground border-none">
      <CardHeader>
        <CardTitle><h2 className="font-headline text-xl">Câmera de Monitoramento</h2></CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="aspect-[4/3] relative">
          <Image
            src={imageUrl}
            alt="Feed da Câmera de Monitoramento"
            fill
            className="object-cover"
            data-ai-hint="campo colheita"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4 bg-card-foreground/5">
            <p className="text-xs text-center text-card-foreground/70">Última captura: {timestamp}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraFeedCard;
