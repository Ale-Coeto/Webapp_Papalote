import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { api } from "~/trpc/react";
import { existingQuestionSchema } from "~/lib/schemas";
import { TextInput } from "./TextInput";
import { ErrorMessage } from "./ErrorMessage";
import { useToast } from "~/hooks/use-toast";

type FormData = z.infer<typeof existingQuestionSchema>;

export const AddQuestionForm = ({
  onCompleted,
  defaultValues,
}: {
  onCompleted: () => void;
  defaultValues?: FormData;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(existingQuestionSchema),
    defaultValues: {
      question: defaultValues?.question,
      questionId: defaultValues?.questionId,
    },
  });

  const { toast } = useToast();
  const utils = api.useUtils();

  const action = defaultValues ? "Modificar" : "Crear";
  const verb = defaultValues ? "modificada" : "creada";

  const createPregunta = api.question.createOrModify.useMutation({
    onSuccess: async (data) => {
      toast({
        title: `Pregunta ${verb}!`,
        description: `${data.question}`,
      });
      await utils.zone.invalidate();
      onCompleted();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    createPregunta.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="m-3 flex flex-col gap-y-4 text-gris">
        <div>
          <label htmlFor="zoneName">Pregunta</label>
          <TextInput id="zoneName" {...register("question")} />
          {errors.question?.message && (
            <ErrorMessage error={errors.question.message} />
          )}
        </div>

        <button className="rounded-lg bg-verde p-3 text-white" type="submit">
          {action} pregunta
        </button>
      </div>
    </form>
  );
};
