"use client";

import { useState } from "react";
import Modal from "~/app/_components/Modal";
import { AddExhbitionForm } from "~/app/_components/form/AddExhibitionForm";
import AddButton from "./form/AddButton";

export const AddExhibitionCircle = ({ zoneId }: { zoneId: number }) => {
  const [openCreate, setOpenCreate] = useState(false);

  return (
    <>
      <AddButton onClick={() => setOpenCreate(true)} />
      {openCreate && (
        <Modal
          title={"Crear exhibición"}
          onClose={() => {
            setOpenCreate(false);
          }}
          isOpen={openCreate}
        >
          <AddExhbitionForm
            zone_id={zoneId}
            onCompleted={() => setOpenCreate(false)}
          />
        </Modal>
      )}
    </>
  );
};
