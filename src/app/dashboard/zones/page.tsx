import { api } from "~/trpc/server";
import { AddZoneCard } from "~/app/_components/card/AddZoneCard";
import { ZoneCard } from "~/app/_components/card/ZoneCard";
import Title from "~/app/_components/Title";

export default async function Zones() {
  const zones = await api.zone.getIds();

  return (
    <main className="min-h-screen bg-fondo px-24 pt-16">
      <div className="">
        <Title text="Zonas" />
      </div>
      <div className="flex w-[90%] flex-col gap-y-4 pt-10">
        {zones.map((zone) => (
          <ZoneCard key={zone.id} zoneId={zone.id} />
        ))}
        <AddZoneCard />
      </div>
    </main>
  );
}
