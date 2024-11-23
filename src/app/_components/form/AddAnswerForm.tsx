import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { api } from "~/trpc/react";
import { existingQuestionAnswerSchema } from "~/lib/schemas";
import { TextInput } from "./TextInput";
import { ErrorMessage } from "./ErrorMessage";
import { useToast } from "~/hooks/use-toast";
import Select from "react-select";

type FormData = z.infer<typeof existingQuestionAnswerSchema>;

export const AddAnswerForm = ({
  onCompleted,
  defaultValues,
  questionId,
}: {
  onCompleted: () => void;
  defaultValues?: FormData;
  questionId: number;
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(existingQuestionAnswerSchema),
    defaultValues: {
      answer: defaultValues?.answer,
      id: defaultValues?.id,
      zone_id: defaultValues?.zone_id,
      question_id: defaultValues?.question_id ?? questionId,
    },
  });

  const { data: zoneIds, isLoading } = api.zone.getOptions.useQuery();

  const processedZoneIds = zoneIds?.map((zone) => ({
    value: zone.id,
    label: zone.name,
  }));

  const defaultOption = processedZoneIds?.find(
    (option) => option.value === defaultValues?.zone_id,
  );

  const { toast } = useToast();
  const utils = api.useUtils();

  const action = defaultValues ? "Modificar" : "Crear";
  const verb = defaultValues ? "modificada" : "creada";

  const createRespuesta = api.question.createOrModifyAnswer.useMutation({
    onSuccess: async (data) => {
      toast({
        title: `Respuesta ${verb}!`,
        description: `${data.answer}`,
      });
      await utils.question.getAnswerById.invalidate();
      await utils.question.getAnswerIds.invalidate();

      onCompleted();
    },
    onError: (error) => {
      toast({
        title: `Error al ${action.toLowerCase()}.`,
        description: `${error.message}`,
      });
      console.error(error);
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    createRespuesta.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="m-3 flex flex-col gap-y-4 text-gris">
        <div>
          <label htmlFor="response">Respuesta</label>
          <TextInput id="response" {...register("answer")} />
          {errors.answer?.message && (
            <ErrorMessage error={errors.answer.message} />
          )}
        </div>
        <div>
          <label htmlFor="zone_id">Zona</label>
          <Select
            className="basic-single"
            classNamePrefix="select"
            defaultValue={{
              value: defaultOption?.value ?? -1,
              label: defaultOption?.label ?? "Elegir una zona",
            }}
            isLoading={isLoading}
            isClearable={true}
            isSearchable={true}
            onChange={(option) => {
              if (option) {
                setValue("zone_id", option.value);
              } else {
                setValue("zone_id", -1);
              }
            }}
            options={processedZoneIds ?? []}
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          />
          {errors.zone_id?.message && (
            <ErrorMessage error={errors.zone_id.message} />
          )}
        </div>
        <button className="rounded-lg bg-verde p-3 text-white" type="submit">
          {action} respuesta
        </button>
      </div>
    </form>
  );
};
