"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/app/_components/shadcn/ui/button";
import Title from "~/app/_components/Title";
import MuseumEntranceChart from "~/app/_components/graficas/museumEntranceChart";
import ExhibitionVisit from "~/app/_components/graficas/exhibitionVisits";
import { api } from "~/trpc/react";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/app/_components/shadcn/ui/card";

export default function StatsPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const museumEntrances = api.museumEntrance.getAll.useQuery();

    const isToday = (date: Date) => {
        const today = new Date();
    return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };
    
    const isNextDayDisabled = () => {
        return isToday(selectedDate);
    };

    const goToNextDay = () => {
        const nextDay = new Date(selectedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        
        const today = new Date();
        
        //Allow navigation up to today
        if (nextDay.getTime() <= today.getTime()) {
            setSelectedDate(nextDay);
        }
    };

    const goToPreviousDay = () => {
        const previousDay = new Date(selectedDate);
        previousDay.setDate(previousDay.getDate() - 1);
        setSelectedDate(previousDay);
    };

    const getTotalVisits = () => {
        if (!museumEntrances.data) return 0;
        
        const MIN_HOUR = 10; // 10 AM
        const MAX_HOUR = 18; // 6 PM
        
        return museumEntrances.data.filter(entrance => {
            const date = new Date(entrance.date);
            const hour = date.getHours();
            
            // Check if same date and within operating hours (10 AM - 6 PM)
            return date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getFullYear() === selectedDate.getFullYear() &&
                hour >= MIN_HOUR && 
                hour < MAX_HOUR;
        }).length;
    };

    return (
        <div className="h-full bg-fondo p-10">
            <div className="mb-10">
                <Title text="Estadisticas" />
            </div>
    
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <Card className="w-full">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">
                                Numero total de visitas del Papalote Museo del Niño en el día
                            </CardTitle>
                            <CardDescription>
                                {selectedDate.toLocaleDateString('es-MX', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-between items-center">
                            <div className="text-2xl font-bold">
                                {getTotalVisits()}
                            </div>
                            <div className="flex items-center gap-4">
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    onClick={goToPreviousDay}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    onClick={goToNextDay}
                                    disabled={isNextDayDisabled()}
                                    className={isNextDayDisabled() ? "opacity-50 cursor-not-allowed" : ""}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                                </div>
                        </CardContent>
                    </Card>
                    <MuseumEntranceChart selectedDate={selectedDate} />
                </div>
                <div className="w-full">
                    <ExhibitionVisit selectedDate={selectedDate} />
                </div>
            </div>
        </div>
    );
}