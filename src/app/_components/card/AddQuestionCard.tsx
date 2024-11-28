"use client";
import { useState } from "react";
import Card from "~/app/_components/card/Card";
import Modal from "~/app/_components/Modal";
import AddButton from "~/app/_components/Button";
import { AddQuestionForm } from "../form/AddQuestionForm";
import Title from "../Title";

export const AddQuestionCard = () => {
  const [openNew, setOpenNew] = useState(false);
  return (
    <>
      <div className="mb-10 flex flex-row items-center justify-between">
        <Title text="Cuestionario" />

        <AddButton
          label="Agregar pregunta"
          onClick={() => {
            setOpenNew(true);
          }}
          isAdd
        />
      </div>
      {/* <Card>
        <div className="my-4 flex flex-row items-center justify-center gap-x-4 text-gris">
          <AddButton onClick={() => setOpenNew(true)} />
          <p className="flex justify-between text-xl font-bold">
            Agregar Pregunta
          </p>
        </div>
      </Card> */}
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
