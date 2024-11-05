"use client";
import { api } from "~/trpc/react";
import Card from "~/app/_components/card/Card";

import BeatLoader from "react-spinners/BeatLoader";
import { InsigniaCircle } from "~/app/_components/InsigniaCircle";
import { cn } from "~/lib/utils";
import Title from "../Title";
import { AddInsigniaCircle } from "~/app/_components/AddInsigniaCircle";

export const InsigniasCard = ({
  zoneId,
  className,
}: {
  zoneId: number;
  className?: string;
}) => {
  const { data: insignias, isLoading } = api.insignia.getIdsByZone.useQuery({
    zoneId: zoneId,
  });

  return (
    <Card className={cn("flex flex-col flex-wrap gap-x-5 gap-y-5", className)}>
      <Title text="Insignias" />
      <div className="flex flex-row items-center gap-x-10 gap-y-10">
        {isLoading ? (
          <div className="flex w-full flex-col items-center">
            <div>
              <BeatLoader className="w-full" color="#2DEA6D" />
            </div>
          </div>
        ) : (
          <>
            {insignias?.map((insignia) => (
              <InsigniaCircle insigniaId={insignia.id} key={insignia.id} />
            ))}
          </>
        )}
        <AddInsigniaCircle zoneId={zoneId} />
      </div>
    </Card>
  );
};
