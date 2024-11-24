"use client";
import { useState } from "react";
import Card from "~/app/_components/card/Card";
import Modal from "~/app/_components/Modal";
import AddButton from "../form/AddButton";
import { AddQuestionForm } from "../form/AddQuestionForm";

export const AddQuestionCard = () => {
  const [openNew, setOpenNew] = useState(false);
  return (
    <>
      <Card>
        <div className="my-4 flex flex-row items-center justify-center gap-x-4 text-gris">
          <AddButton onClick={() => setOpenNew(true)} />
          <p className="flex justify-between text-xl font-bold">
            Agregar Pregunta
          </p>
        </div>
      </Card>
      {openNew && (
        <Modal
          title={"Agregar Pregunta"}
          onClose={() => setOpenNew(false)}
          isOpen={openNew}
        >
          <AddQuestionForm onCompleted={() => setOpenNew(false)} />
        </Modal>
      )}
    </>
  );
};
