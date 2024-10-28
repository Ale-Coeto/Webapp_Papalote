"use client";

import { useState } from "react";
import Modal from "~/app/_components/Modal";
import { AddInsigniaForm } from "~/app/_components/form/AddInsigniaForm";
import AddButton from "./form/AddButton";

export const AddInsigniaCircle = ({ zoneId }: { zoneId: string }) => {
  const [openCreate, setOpenCreate] = useState(false);

  return (
    <>
      <AddButton onClick={() => setOpenCreate(true)} />

      {openCreate && (
        <Modal
          title={"Crear Insignia"}
          onClose={() => {
            setOpenCreate(false);
          }}
          isOpen={openCreate}
        >
          <AddInsigniaForm
            zone_id={zoneId}
            onCompleted={() => setOpenCreate(false)}
          />
        </Modal>
      )}
    </>
  );
};
