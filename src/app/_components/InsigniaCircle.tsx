"use client";

import { useState } from "react";
import Modal from "~/app/_components/Modal";
import { Circle } from "~/app/_components/CircleButton";
import { api } from "~/trpc/react";
import BeatLoader from "react-spinners/BeatLoader";
import { AddInsigniaForm } from "~/app/_components/form/AddInsigniaForm";

export const InsigniaCircle = ({ insigniaId }: { insigniaId: number }) => {
  const [openEdit, setOpenEdit] = useState(false);
  const { data: insignia } = api.insignia.getById.useQuery({ id: insigniaId });

  return (
    <>
      <Circle onClick={() => setOpenEdit(true)}>
        {insignia ? (
          <div
            className="my-4 flex flex-row items-center justify-center gap-x-4 text-gris"
            style={{ backgroundImage: `url('/Papalote_entrada.png')` }}
          ></div>
        ) : (
          <BeatLoader color="#2DEA6D" />
        )}
      </Circle>
      {insignia && openEdit && (
        <Modal
          title={"Editar Insignia"}
          onClose={() => {
            setOpenEdit(false);
          }}
          isOpen={openEdit}
        >
          <AddInsigniaForm
            zone_id={insignia.zone_id}
            onCompleted={() => setOpenEdit(false)}
            defaultValues={{
              insigniaDescription: insignia.description,
              insigniaLogo: insignia.logo,
              insigniaName: insignia.name,
              insigniaNfcCode: insignia.nfc_code,
              zone_id: insignia.zone_id,
              insigniaId: insignia.id,
              insigniaSpecialEventId: insignia.special_event_id ?? undefined,
            }}
          />
        </Modal>
      )}
    </>
  );
};
