"use client";

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import type { AlertingSensor } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AlertingSensorsCardProps {
  sensors: AlertingSensor[];
}

const AlertingSensorsCard: FC<AlertingSensorsCardProps> = ({ sensors }) => {
  return (
    <Card className="rounded-2xl shadow-lg h-full bg-card text-card-foreground border-destructive/50 border-2">
      <CardHeader className="flex-row items-center gap-3 space-y-0">
        <AlertTriangle className="w-8 h-8 text-destructive" />
        <div>
          <CardTitle><h2 className="font-headline text-xl text-destructive">Sensors in Alert</h2></CardTitle>
          <CardDescription className="text-card-foreground/70">Readings outside the normal range.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {sensors.length > 0 ? (
          <ul className="space-y-3">
            {sensors.map((sensor, index) => (
              <li key={index} className="flex justify-between items-center p-3 rounded-lg bg-destructive/10">
                <span className="font-medium text-card-foreground">{sensor.sensor}</span>
                <span className={cn(
                  "font-semibold",
                  sensor.level === 'Critical' ? 'text-destructive' : 'text-amber-400'
                )}>
                  {sensor.value}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className="text-card-foreground/70">All sensors are operating within normal parameters.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertingSensorsCard;
