import { api, HydrateClient } from "~/trpc/server";
import { MainTitle } from "~/app/_components/MainTitle";
import { DescriptionCard } from "~/app/_components/card/DescriptionCard";

export default async function Zone({ params }: { params: { id: string } }) {
  const zone = await api.zone.getZoneOverviewById({ id: params.id });
  return (
    <HydrateClient>
      <main className="min-h-screen bg-fondo px-24 pt-16">
        <MainTitle className="mb-6" text={`Zonas > ${zone?.name}`} />
        <div className="flex flex-col gap-y-4">
          <DescriptionCard zoneId={params.id} />
        </div>
      </main>
    </HydrateClient>
  );
}
