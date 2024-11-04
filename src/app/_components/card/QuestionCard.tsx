"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import Card from "~/app/_components/card/Card";

import BeatLoader from "react-spinners/BeatLoader";
import Link from "next/link";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Modal from "~/app/_components/Modal";
import { toast } from "~/hooks/use-toast";
import { AddQuestionForm } from "../form/AddQuestionForm";

export const QuestionCard = ({
  questionNumber,
  questionId,
}: {
  questionNumber: number;
  questionId: string;
}) => {
  const { data: question } = api.question.getById.useQuery({ id: questionId });
  const deleteQuestion = api.question.delete.useMutation({
    onSuccess: async (data) => {
      toast({
        title: "Pregunta Borrada!",
        description: `Pregunta: ${data.question}`,
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);

  return (
    <>
      <Card>
        {question ? (
          <div className="flex flex-row items-center">
            <div className={`h-8 w-8 rounded-full bg-gris text-gray-600`}>
              {questionNumber}
            </div>
            <div className="ml-5 mr-auto flex flex-col">
              <p className="font-bold text-gris">{question.question}</p>
            </div>
            <div className="ml-auto flex flex-row gap-x-6">
              <FaEdit
                className="text-lg text-azul duration-200 hover:text-azul-200"
                onClick={() => setOpenModalEdit(true)}
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
          title={"Agregar Zona"}
          onClose={() => {
            setOpenModalDelete(false);
          }}
          isOpen={openModalDelete}
        >
          <p>
            ¿Estás seguro de que quieres borrar la pregunta &quot;
            {question?.question}
            &quot;?
          </p>
          <button
            className="mt-2 rounded-lg bg-red-500 p-2 text-white"
            onClick={() => {
              deleteQuestion.mutate({ id: questionId });
              setOpenModalDelete(false);
            }}
          >
            Borrar
          </button>
        </Modal>
      )}

      {openModalEdit && (
        <Modal
          title={"Modificar Pregunta"}
          onClose={() => {
            setOpenModalEdit(false);
          }}
          isOpen={openModalEdit}
        >
          <AddQuestionForm
            defaultValues={
              question
                ? {
                    question: question.question,
                    questionId: question.id,
                  }
                : undefined
            }
            onCompleted={() => setOpenModalEdit(false)}
          />
        </Modal>
      )}
    </>
  );
};
