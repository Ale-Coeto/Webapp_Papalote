"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import Card from "~/app/_components/card/Card";

import BeatLoader from "react-spinners/BeatLoader";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Modal from "~/app/_components/Modal";
import { toast } from "~/hooks/use-toast";
import { AddQuestionForm } from "../form/AddQuestionForm";
import { AddAnswerForm } from "../form/AddAnswerForm";
import { AnswerCard } from "./AnswerCard";

export const QuestionCard = ({
  questionNumber,
  questionId,
}: {
  questionNumber: number;
  questionId: number;
}) => {
  const { data: question } = api.question.getById.useQuery({ id: questionId });
  const utils = api.useUtils();

  const deleteQuestion = api.question.delete.useMutation({
    onSuccess: async (data) => {
      toast({
        title: "Pregunta Borrada!",
        description: `Pregunta: ${data.question}`,
      });
      await utils.question.getById.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const { data: answerIds } = api.question.getAnswerIds.useQuery({
    questionId: questionId,
  });

  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalEditAnswer, setOpenModalEditAnswer] = useState(false);

  return (
    <>
      <Card>
        {question ? (
          <div className="flex flex-col">
            <div className="flex flex-row items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full bg-gris font-bold text-white`}
              >
                {questionNumber}
              </div>
              <div className="ml-5 mr-auto flex flex-col">
                <p className="font-bold text-gris">{question.question}</p>
              </div>
              <div className="ml-auto flex flex-row gap-x-6">
                <button
                  onClick={() => setOpenModalEditAnswer(true)}
                  className="rounded bg-verde px-4 py-2 font-semibold text-white hover:bg-verde-200"
                >
                  Agregar Respuesta
                </button>
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
            {answerIds && answerIds.length > 0 && (
              <div className="mt-2 flex flex-col gap-y-2">
                <p className="font-semibold text-gris">Respuestas:</p>
                <div className="flex flex-row flex-wrap gap-3">
                  {answerIds.map((answer) => (
                    <AnswerCard
                      className="w-fit"
                      key={answer.id}
                      answerId={answer.id}
                    />
                  ))}
                </div>
              </div>
            )}
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
          title={"Eliminar Pregunta"}
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

      {openModalEditAnswer && (
        <Modal
          title={"Agregar Respuesta"}
          onClose={() => setOpenModalEditAnswer(false)}
          isOpen={openModalEditAnswer}
        >
          <AddAnswerForm
            onCompleted={() => setOpenModalEditAnswer(false)}
            questionId={questionId}
          />
        </Modal>
      )}
    </>
  );
};
