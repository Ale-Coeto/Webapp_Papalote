"use client";
import { useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import Card from "~/app/_components/card/Card";
import Modal from "~/app/_components/Modal";
import { AddZoneForm } from "~/app/_components/form/AddZoneForm";

export const AddZoneCard = () => {
  const [openNew, setOpenNew] = useState(false);
  return (
    <>
      <Card onClick={() => setOpenNew(true)}>
        <div className="my-4 flex flex-row items-center justify-center gap-x-4 text-gris">
          <IoMdAddCircleOutline size={30} />
          <p className="flex justify-between text-xl font-bold">Agregar Zona</p>
        </div>
      </Card>
      {openNew && (
        <Modal
          title={"Agregar Zona"}
          onClose={() => {
            console.log("executed close");
            setOpenNew(false);
          }}
          isOpen={openNew}
        >
          <AddZoneForm onCompleted={() => setOpenNew(false)} />
        </Modal>
      )}
    </>
  );
};
