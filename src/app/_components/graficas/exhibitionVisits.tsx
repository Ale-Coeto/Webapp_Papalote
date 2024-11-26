"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts";
import { api } from "~/trpc/react";
import Title from "~/app/_components/Title";

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
    visitors: {
        label: "Visitas",
    },
    pertenezco: {
        label: "Pertenezco",
        color: "hsl(var(--color-pertenezco))"
    },
    comunico: {
        label: "Comunico", 
        color: "hsl(var(--chart-2))"
    },
    comprendo: {
        label: "Comprendo",
        color: "hsl(var(--chart-3))" 
    },
    soy: {
        label: "Soy",
        color: "hsl(var(--chart-4))"
    },
    expreso: {
        label: "Expreso",
        color: "hsl(var(--chart-5))"
    },
    pequenos: {
        label: "Pequeños",
        color: "hsl(var(--chart-6))"
    },
} satisfies ChartConfig;

const exhibitionNames = {
    "2": "Pertenezco",
    "3": "Comunico",
    "4": "Comprendo",
    "5": "Soy",
    "6": "Expreso",
    "7": "Pequeños",
    "8": "ES",
};

const exhibitionColors = {
    "2": "#C4D600", //Color for Pertenezco
    "3": "#006BA6", // Color for Comunico
    "4": "#84329B", // Color for Comprendo
    "5": "#D50032", // Color for Soy
    "6": "#FF8200", // Color for Expreso
    "7": "#009CA6", // Color for Pequeños
    "8": "#808080", // Color for Eventos Especiales
    };

    interface ExhibitionVisitProps {
    selectedDate: Date;
    }

    export default function ExhibitionVisit({ selectedDate }: ExhibitionVisitProps) {
        const exhibitionVisits = api.visit.getExhibitionVisits.useQuery();
    
        const isSelectedDate = (dateObj: Date) => {
        return dateObj.getDate() === selectedDate.getDate() &&
            dateObj.getMonth() === selectedDate.getMonth() &&
            dateObj.getFullYear() === selectedDate.getFullYear();
        };

        const formatDate = () => {
            return selectedDate.toLocaleDateString('es-MX', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
            });
        };
        interface ExhibitionVisit {
            date: Date;
            exhibition_id: string;
          }
    
        const transformData = (data: ExhibitionVisit[]) => {
            const selectedDateVisits = data.filter(visit => isSelectedDate(visit.date));
            
            const exhibitionCounts = selectedDateVisits.reduce((acc: Record<string, number>, visit) => {
                acc[visit.exhibition_id] = (acc[visit.exhibition_id] ?? 0) + 1;
                return acc;
            }, {});
        
            return Object.entries(exhibitionCounts).map(([id, count]) => ({
                zona: exhibitionNames[id as keyof typeof exhibitionNames] ?? `Exhibition ${id}`,
                Visitas: count,
                fill: exhibitionColors[id as keyof typeof exhibitionColors] ?? "#808080"
            }));
        };
    
        const chartData = exhibitionVisits.data ? transformData(exhibitionVisits.data) : [];
    
    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>Visitas por zonas - {formatDate()}</CardTitle>
                <CardDescription>
                    Una visita por zona es registrada cuando una persona completa una exhibición con un Primo y obtiene una insignia de zona.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end">
                <ChartContainer config={chartConfig} className="h-[400px] w-full mt-auto">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="zona"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                angle={chartData.length >= 7 ? -20 : 0} // Rotación en grados
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar
                                dataKey="Visitas"
                                fill="var(--color-Visitas)"
                                radius={[8, 8, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}