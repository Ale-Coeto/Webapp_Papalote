"use client";
import { api } from "~/trpc/react";
import { AddZoneCard } from "~/app/_components/card/AddZoneCard";
import { ZoneCard } from "~/app/_components/card/ZoneCard";
import BeatLoader from "react-spinners/BeatLoader";
import { MainTitle } from "~/app/_components/MainTitle";

export default function Zones() {
  const { data: zones, isLoading } = api.zone.getIds.useQuery();

  return (
    <main className="min-h-screen bg-fondo px-24 pt-16">
      <div className="">
        <MainTitle text="Zonas" />
      </div>
      <div className="flex w-[90%] flex-col gap-y-4 pt-10">
        {zones?.map((zone) => <ZoneCard key={zone.id} zoneId={zone.id} />)}
        {isLoading && <BeatLoader className="mx-auto w-full" color="#2DEA6D" />}
        <AddZoneCard />
      </div>
    </main>
  );
}
