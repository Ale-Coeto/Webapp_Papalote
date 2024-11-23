"use client";
import { useState } from "react";
import Card from "~/app/_components/card/Card";
import Modal from "~/app/_components/Modal";
import { AddZoneForm } from "~/app/_components/form/AddZoneForm";
import AddButton from "../form/AddButton";

export const AddZoneCard = () => {
  const [openNew, setOpenNew] = useState(false);
  return (
    <>
      <Card>
        <div className="my-4 flex flex-row items-center justify-center gap-x-4 text-gris">
          <AddButton onClick={() => setOpenNew(true)} />
          <p className="flex justify-between text-xl font-bold">Agregar Zona</p>
        </div>
      </Card>
      {openNew && (
        <Modal
          title={"Agregar Zona"}
          onClose={() => setOpenNew(false)}
          isOpen={openNew}
        >
          <AddZoneForm onCompleted={() => setOpenNew(false)} />
        </Modal>
      )}
    </>
  );
};
