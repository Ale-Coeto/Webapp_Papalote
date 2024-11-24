"use client";

import { useState } from "react";
import Modal from "~/app/_components/Modal";
import { Circle } from "~/app/_components/CircleButton";
import { api } from "~/trpc/react";
import BeatLoader from "react-spinners/BeatLoader";
import { AddExhbitionForm } from "./form/AddExhibitionForm";

export const ExhibitionCircle = ({ insigniaId }: { insigniaId: number }) => {
  const [openEdit, setOpenEdit] = useState(false);
  const { data: exhibition } = api.exhibition.getById.useQuery({
    id: insigniaId,
  });

  return (
    <>
      <Circle onClick={() => setOpenEdit(true)}>
        {exhibition ? (
          <div
            className="my-4 flex flex-row items-center justify-center gap-x-4 text-gris"
            style={{ backgroundImage: `url('/Papalote_entrada.png')` }}
          ></div>
        ) : (
          <BeatLoader color="#2DEA6D" />
        )}
      </Circle>
      {exhibition && openEdit && (
        <Modal
          title={"Editar Exhbición"}
          onClose={() => {
            setOpenEdit(false);
          }}
          isOpen={openEdit}
        >
          <AddExhbitionForm
            zone_id={exhibition.zone_id}
            onCompleted={() => setOpenEdit(false)}
            defaultValues={{
              exhibitionDescription: exhibition.description,
              exhibitionId: exhibition.id,
              exhibitionImage: exhibition.image ?? undefined,
              exhibitionName: exhibition.name,
              exhibitionIsOpen: exhibition.is_open,
              zone_id: exhibition.zone_id ?? "",
            }}
          />
        </Modal>
      )}
    </>
  );
};
