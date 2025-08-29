"use client";

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { LoggedAlert } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AlertsLogCardProps {
  alerts: LoggedAlert[];
}

const AlertsLogCard: FC<AlertsLogCardProps> = ({ alerts }) => {
  return (
    <Card className="rounded-2xl shadow-lg h-full bg-card text-card-foreground border-none">
      <CardHeader>
        <CardTitle><h2 className="font-headline text-xl">Log de Alertas Recentes</h2></CardTitle>
        <CardDescription className="text-card-foreground/70">Um feed cronológico de eventos da estação.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-4">
              <div className="text-xs font-mono text-card-foreground/60 pt-1 w-20">{alert.timestamp}</div>
              <div className="flex-1 flex items-center gap-2">
                <Badge
                  variant={alert.type === 'Alert' ? 'destructive' : 'secondary'}
                  className={cn(
                    "border-transparent",
                    alert.type === 'Alerta' ? 'bg-destructive/80' : 'bg-primary/20 text-primary-foreground',
                  )}
                >
                  {alert.type}
                </Badge>
                <p className="text-sm">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsLogCard;
