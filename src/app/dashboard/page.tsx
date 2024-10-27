import { api, HydrateClient } from "~/trpc/server";
import { MainTitle } from "../_components/MainTitle";
import { AddZoneCard } from "../_components/AddZoneCard";
import { ZoneCard } from "../_components/ZoneCard";

export default async function Home() {
  const zones = await api.zone.getIds();

  return (
    <HydrateClient>
      <main className="min-h-screen bg-fondo px-24 pt-16">
        <MainTitle className="mb-6" text="Zonas" />
        <div className="flex w-[90%] flex-col gap-y-4">
          {zones.map((zone) => (
            <ZoneCard key={zone.id} zoneId={zone.id} />
          ))}
          <AddZoneCard />
        </div>
      </main>
    </HydrateClient>
  );
}
