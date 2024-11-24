"use client";

import { useState, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { api } from "~/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/app/_components/shadcn/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/app/_components/shadcn/ui/chart";

const chartConfig = {
  entrances: {
    label: "Entradas",
    color: "#8DE049",
  }
} satisfies ChartConfig;

interface MuseumEntrancesChartProps {
  selectedDate: Date;
}

interface MuseumEntrance {
    date: Date;
    id: number;
    // Add other fields if needed
  }
  
  export default function MuseumEntrancesChart({ selectedDate }: MuseumEntrancesChartProps) {
      const museumEntrances = api.museumEntrance.getAll.useQuery<MuseumEntrance[]>();
    
      const isSelectedDate = (date: Date) => {
        return date.getDate() === selectedDate.getDate() &&
          date.getMonth() === selectedDate.getMonth() &&
          date.getFullYear() === selectedDate.getFullYear();
      };
    
      const getTimeInterval = (date: Date) => {
        const hour = date.getHours();
        const intervalStart = Math.floor(hour / 2) * 2;
        return `${intervalStart.toString().padStart(2, '0')}:00-${(intervalStart + 2).toString().padStart(2, '0')}:00`;
      };
    
      const transformData = (data: MuseumEntrance[]) => {
          const selectedDateEntries = data.filter(entrance => isSelectedDate(entrance.date));
        
          const entrancesByInterval = selectedDateEntries.reduce((acc: Record<string, number>, entrance) => {
            const date = new Date(entrance.date);
            const hour = date.getHours();
            if (hour >= 10 && hour < 18) {
              const interval = getTimeInterval(date);
              acc[interval] = (acc[interval] ?? 0) + 1;
            }
            return acc;
          }, {});
        
          const timeSlots = [];
          for (let i = 10; i < 18; i += 2) {
            const interval = `${i.toString().padStart(2, '0')}:00-${(i + 2).toString().padStart(2, '0')}:00`;
            timeSlots.push({
              time: interval,
              entrances: entrancesByInterval[interval] ?? 0
            });
          }
        
          return timeSlots;
      };
  
      const chartData = museumEntrances.data ? transformData(museumEntrances.data) : [];
    
    const formattedDate = selectedDate.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return (
      <Card>
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5">
            <CardTitle>Entradas al Museo - {formattedDate}</CardTitle>
            <CardDescription>Total de visitas</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    nameKey="entrances"
                  />
                }
              />
              <Bar 
                dataKey="entrances" 
                fill={chartConfig.entrances.color}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    );
}