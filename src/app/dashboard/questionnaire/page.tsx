import { api, HydrateClient } from "~/trpc/server";
import { MainTitle } from "~/app/_components/MainTitle";
import { QuestionCard } from "~/app/_components/card/QuestionCard";
import { AddQuestionCard } from "~/app/_components/card/AddQuestionCard";

export default async function Home() {
  const questions = await api.question.getIds();

  return (
    <HydrateClient>
      <main className="min-h-screen bg-fondo px-24 pt-16">
        <MainTitle className="mb-6" text="Cuestionario" />
        <div className="flex w-[90%] flex-col gap-y-4">
          {questions.map((question, i) => (
            <QuestionCard
              key={question.id}
              questionId={question.id}
              questionNumber={i + 1}
            />
          ))}
          <AddQuestionCard />
        </div>
      </main>
    </HydrateClient>
  );
}
