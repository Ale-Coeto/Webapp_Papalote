"use client";
import { api } from "~/trpc/react";
import Card from "~/app/_components/card/Card";

import BeatLoader from "react-spinners/BeatLoader";
import { InsigniaCircle } from "~/app/_components/InsigniaCircle";
import { cn } from "~/lib/utils";
import Title from "../Title";
import { AddInsigniaCircle } from "~/app/_components/AddInsigniaCircle";

export const InsigniasCard = ({
  zoneId = -1,
  eventId = -1,
  className,
}: {
  zoneId?: number;
  eventId?: number;
  className?: string;
}) => {
  /*
  const { data: insignias, isLoading } = api.insignia.getIdsByZone.useQuery({
    zoneId: zoneId,
  });
  */

   // Fetch insignias by zone if zoneId is not -1
   const { data: insigniasByZone, isLoading: isLoadingZone } =
   api.insignia.getIdsByZone.useQuery(
     { zoneId },
     { enabled: zoneId !== -1 }
   );

 // Fetch insignias by event if eventId is not -1 and zoneId is -1
 const { data: insigniasByEvent, isLoading: isLoadingEvent } =
   api.insignia.getIdsByEvent.useQuery(
     { eventId },
     { enabled: eventId !== -1 && zoneId === -1 }
   );

  const insignias = zoneId !== -1 ? insigniasByZone : insigniasByEvent;
  const isLoading = (zoneId !== -1 && isLoadingZone) || isLoadingEvent;



  // Fetch insignias by zone if zoneId is not -1
  const { data: insigniasTest, isLoading: yourMom } =
  api.insignia.getAllInfoByZone.useQuery(
    { zoneId },
    { enabled: zoneId !== -1 }
  );
  console.log("this are the insignias we have: ")
  console.log(insignias)
  console.log("this is the event id: ")
  console.log(eventId)
  return (
    <Card className={cn("flex flex-col flex-wrap gap-x-5 gap-y-5", className)}>
      <Title text="Insignias" />
      <div className="flex flex-row flex-wrap items-center gap-x-10 gap-y-10">
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
        {zoneId !== -1 && <AddInsigniaCircle zoneId={zoneId} />}
        {eventId !== -1 && <AddInsigniaCircle eventId={eventId} />}
      </div>
    </Card>
  );
};
