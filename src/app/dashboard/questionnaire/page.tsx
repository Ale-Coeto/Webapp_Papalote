"use client";
import { api } from "~/trpc/react";
import { MainTitle } from "~/app/_components/MainTitle";
import { QuestionCard } from "~/app/_components/card/QuestionCard";
import { AddQuestionCard } from "~/app/_components/card/AddQuestionCard";
import Title from "~/app/_components/Title";

export default function Home() {
  const { data: questions, isLoading } = api.question.getIds.useQuery();

  return (
    <>
      <main className="min-h-screen bg-fondo px-24 pt-16">
        {/* <MainTitle className="mb-6" text="Cuestionario" /> */}
        <div className="flex w-[90%] flex-col gap-y-4">
          <AddQuestionCard />
          {isLoading && <Title text="Cargando..." />}
          <div className="flex flex-col gap-8 pb-20">
            {questions?.map((question, i) => (
              <QuestionCard
                key={question.id}
                questionId={question.id}
                questionNumber={i + 1}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
