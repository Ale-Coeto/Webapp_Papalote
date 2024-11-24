"use client";
import { api } from "~/trpc/react";
import Card from "~/app/_components/card/Card";

import BeatLoader from "react-spinners/BeatLoader";
import { cn } from "~/lib/utils";
import Title from "../Title";
import { ExhibitionCircle } from "../ExhibitionCircle";
import { AddExhibitionCircle } from "../AddExhibitionCircle";

export const ExhibitionsCard = ({
  zoneId,
  className,
}: {
  zoneId: number;
  className?: string;
}) => {
  const { data: exhibiciones, isLoading } =
    api.exhibition.getIdsByZone.useQuery({
      zoneId: zoneId,
    });

  return (
    <Card className={cn("flex flex-col flex-wrap gap-x-5 gap-y-5", className)}>
      <Title text="Exhibiciones" />
      <div className="flex flex-row items-center gap-x-10 gap-y-10">
        {isLoading ? (
          <div className="flex w-full flex-col items-center">
            <div>
              <BeatLoader className="w-full" color="#2DEA6D" />
            </div>
          </div>
        ) : (
          <>
            {exhibiciones?.map((exhibicion) => (
              <ExhibitionCircle
                insigniaId={exhibicion.id}
                key={exhibicion.id}
              />
            ))}
          </>
        )}
        <AddExhibitionCircle zoneId={zoneId} />
      </div>
    </Card>
  );
};
