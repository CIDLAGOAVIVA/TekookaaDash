"use client";

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { ActivityProgress } from '@/lib/types';
import { CheckCircle2 } from 'lucide-react';

interface ActivityProgressCardProps {
  activities: ActivityProgress[];
}

const ActivityProgressItem: FC<{ activity: ActivityProgress }> = ({ activity }) => {
  const percentage = (activity.current / activity.total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <span className="font-medium text-card-foreground">{activity.name}</span>
        <span className="text-sm text-card-foreground/70">
          {activity.current.toLocaleString()} / {activity.total.toLocaleString()} {activity.unit}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Progress value={percentage} className="h-2" />
        <span className="text-xs font-semibold text-card-foreground w-12 text-right">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
};


const ActivityProgressCard: FC<ActivityProgressCardProps> = ({ activities }) => {
  return (
    <Card className="rounded-2xl shadow-lg h-full bg-card text-card-foreground border-none">
      <CardHeader className="flex-row items-center gap-3 space-y-0">
        <CheckCircle2 className="w-8 h-8 text-primary" />
        <div>
          <CardTitle><h2 className="font-headline text-xl">Progresso das Atividades</h2></CardTitle>
          <CardDescription className="text-card-foreground/70">Acompanhe as tarefas do campo.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            {activities.map((activity, index) => (
                <ActivityProgressItem key={index} activity={activity} />
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityProgressCard;
