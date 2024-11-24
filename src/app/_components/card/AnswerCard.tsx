"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import Card from "~/app/_components/card/Card";

import BeatLoader from "react-spinners/BeatLoader";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Modal from "~/app/_components/Modal";
import { toast } from "~/hooks/use-toast";
import { AddAnswerForm } from "../form/AddAnswerForm";
import clsx from "clsx";

export const AnswerCard = ({
  answerId,
  className,
}: {
  answerId: number;
  className?: string;
}) => {
  const { data: answer } = api.question.getAnswerById.useQuery({
    id: answerId,
  });
  const { data: zone } = api.zone.getById.useQuery(
    { id: answer?.zone_id ?? 0 },
    { enabled: !!answer?.zone_id },
  );
  const deleteAnswer = api.question.deleteAnswer.useMutation({
    onSuccess: async (data) => {
      toast({
        title: "Respuesta Borrada!",
        description: `Respuesta: ${data.answer}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Ocurrió un error.",
        description: `${error.message}`,
      });
      console.error(error);
    },
  });

  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalEditAnswer, setOpenModalEditAnswer] = useState(false);

  return (
    <>
      <Card className={clsx("border-gris shadow-lg", className)}>
        {answer ? (
          <div className="flex flex-row flex-wrap items-center">
            <div className="mb-3 ml-5 mr-auto flex flex-col">
              <p className="text-gris">
                <span className="font-bold">Zona:</span>{" "}
                {zone?.name ?? "Cargando..."}
              </p>
              <p className="text-gris">
                <span className="font-bold">Respuesta:</span> {answer.answer}
              </p>
            </div>
            <div className="ml-5 flex flex-row gap-x-6">
              <FaEdit
                className="text-lg text-azul duration-200 hover:text-azul-200"
                onClick={() => setOpenModalEditAnswer(true)}
                size={26}
              />
              <FaTrashAlt
                className="text-red-500 duration-200 hover:text-red-700"
                onClick={() => setOpenModalDelete(true)}
                size={25}
              />
            </div>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center">
            <div>
              <BeatLoader className="w-full" color="#2DEA6D" />
            </div>
          </div>
        )}
      </Card>
      {openModalDelete && (
        <Modal
          title={"Eliminar Respuesta"}
          onClose={() => {
            setOpenModalDelete(false);
          }}
          isOpen={openModalDelete}
        >
          <p>
            ¿Estás seguro de que quieres borrar la respuesta &quot;
            {answer?.answer}
            &quot;?
          </p>
          <button
            className="mt-2 rounded-lg bg-red-500 p-2 text-white"
            onClick={() => {
              deleteAnswer.mutate({ id: answerId });
              setOpenModalDelete(false);
            }}
          >
            Borrar
          </button>
        </Modal>
      )}

      {openModalEditAnswer && answer?.question_id && (
        <Modal
          title={"Agregar Respuesta"}
          onClose={() => setOpenModalEditAnswer(false)}
          isOpen={openModalEditAnswer}
        >
          <AddAnswerForm
            onCompleted={() => setOpenModalEditAnswer(false)}
            questionId={answer?.question_id}
            defaultValues={
              answer
                ? {
                    answer: answer.answer,
                    zone_id: answer.zone_id,
                    question_id: answer.question_id,
                    id: answer.id,
                  }
                : undefined
            }
          />
        </Modal>
      )}
    </>
  );
};
