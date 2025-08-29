"use client";

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sun, Cloud, CloudRain, CloudSun, Cloudy } from 'lucide-react';
import type { WeatherForecast, DailyForecast, HourlyForecast } from '@/lib/types';
import { cn } from '@/lib/utils';

const weatherIcons: { [key: string]: JSX.Element } = {
  Sun: <Sun className="w-8 h-8 text-yellow-400" />,
  CloudRain: <CloudRain className="w-8 h-8 text-blue-400" />,
  CloudSun: <CloudSun className="w-8 h-8 text-yellow-300" />,
  Cloudy: <Cloudy className="w-8 h-8 text-gray-400" />,
};

const WeatherIcon: FC<{ iconName: string; className?: string }> = ({ iconName, className }) => {
    const Icon = { Sun, CloudRain, CloudSun, Cloudy }[iconName as keyof typeof weatherIcons] || Cloud;
    return <Icon className={cn("w-6 h-6", className)} />;
};

const DailyForecastItem: FC<{ item: DailyForecast }> = ({ item }) => (
    <div className="flex items-center justify-between py-2 border-b border-card-foreground/10 last:border-b-0">
        <p className="w-1/4 font-medium">{item.day}</p>
        <div className="w-1/4 flex justify-center">
            <WeatherIcon iconName={item.icon} className="w-7 h-7" />
        </div>
        <p className="w-1/4 text-center text-sm">{item.precipitation}% Rain</p>
        <p className="w-1/4 text-right font-semibold">{item.minTemp}° / {item.maxTemp}°</p>
    </div>
)

const HourlyForecastItem: FC<{ item: HourlyForecast }> = ({ item }) => (
    <div className="flex flex-col items-center gap-2 p-2 rounded-lg bg-card/50 text-center flex-shrink-0 w-20">
        <p className="text-sm font-medium">{item.time}</p>
        <WeatherIcon iconName={item.icon} className="w-8 h-8" />
        <p className="text-lg font-bold">{item.temp}°</p>
        <p className="text-xs text-card-foreground/70">{item.precipitation}%</p>
    </div>
)

interface WeatherForecastCardProps {
  forecast: WeatherForecast;
}

const WeatherForecastCard: FC<WeatherForecastCardProps> = ({ forecast }) => {
  return (
    <Card className="rounded-2xl shadow-lg h-full bg-card text-card-foreground border-none">
      <CardHeader>
        <CardTitle><h2 className="font-headline text-xl">Weather Forecast</h2></CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="24h" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-card-foreground/5">
            <TabsTrigger value="24h">Next 24 Hours</TabsTrigger>
            <TabsTrigger value="5d">Next 5 Days</TabsTrigger>
          </TabsList>
          <TabsContent value="24h" className="mt-4">
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                {forecast.twentyFourHours.map((item) => <HourlyForecastItem key={item.time} item={item} />)}
            </div>
          </TabsContent>
          <TabsContent value="5d" className="mt-4">
             <div className="flex flex-col gap-1">
                {forecast.fiveDays.map((item) => <DailyForecastItem key={item.day} item={item} />)}
             </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WeatherForecastCard;
