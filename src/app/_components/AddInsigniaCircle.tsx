"use client";

import { useState } from "react";
import Modal from "~/app/_components/Modal";
import { AddInsigniaForm } from "~/app/_components/form/AddInsigniaForm";
import AddButton from "./form/AddButton";

export const AddInsigniaCircle = ({ zoneId = -1, eventId = -1}: { zoneId?: number, eventId?: number }) => {
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
          {zoneId !== -1 &&
            <AddInsigniaForm
            zone_id={zoneId}
            onCompleted={() => setOpenCreate(false)}
          />
          }
          {eventId !== -1 &&
            <AddInsigniaForm
            event_id={eventId}
            onCompleted={() => setOpenCreate(false)}
          />
          }
        </Modal>
      )}
    </>
  );
};
