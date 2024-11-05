import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { api } from "~/trpc/react";
import { existingInsigniaSchema, existingZoneSchema } from "~/lib/schemas";
import { TextInput } from "./TextInput";
import { ErrorMessage } from "./ErrorMessage";
import { useToast } from "~/hooks/use-toast";

type FormData = z.infer<typeof existingInsigniaSchema>;

export const AddInsigniaForm = ({
  onCompleted,
  defaultValues,
  zone_id,
}: {
  onCompleted: () => void;
  defaultValues?: FormData;
  zone_id: number;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(existingInsigniaSchema),
    defaultValues: {
      insigniaDescription: defaultValues?.insigniaDescription,
      insigniaId: defaultValues?.insigniaId,
      insigniaLogo: defaultValues?.insigniaLogo,
      insigniaName: defaultValues?.insigniaName,
      insigniaNfcCode: defaultValues?.insigniaNfcCode,
      insigniaSpecialEventId: defaultValues?.insigniaSpecialEventId,
      zone_id: defaultValues?.zone_id ?? zone_id,
    },
  });

  const { toast } = useToast();
  const utils = api.useUtils();

  const action = defaultValues ? "Modificar" : "Crear";
  const verb = defaultValues ? "modificada" : "creada";

  const createInsignia = api.insignia.createOrModify.useMutation({
    onSuccess: async (data) => {
      toast({
        title: `¡Insignia ${verb}!`,
        description: `${data.name} | ${data.nfc_code}`,
      });
      await utils.insignia.invalidate();
      onCompleted();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const deleteInsignia = api.insignia.delete.useMutation({
    onSuccess: async (data) => {
      toast({
        title: "Insignia Borrada!",
        description: `Nombre: ${data.name}}`,
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    createInsignia.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="m-3 flex flex-col gap-y-4 text-gris">
        <div>
          <label htmlFor="insigniaName">Nombre de la insignia</label>
          <TextInput id="insigniaName" {...register("insigniaName")} />
          {errors.insigniaName?.message && (
            <ErrorMessage error={errors.insigniaName.message} />
          )}
        </div>
        <div>
          <label htmlFor="insigniaDescription">
            Descripción de la insignia
          </label>
          <TextInput
            id="insigniaDescription"
            {...register("insigniaDescription")}
          />

          {errors.insigniaDescription?.message && (
            <ErrorMessage error={errors.insigniaDescription.message} />
          )}
        </div>
        <div>
          <label htmlFor="insigniaNfcCode">NFC de la insignia</label>
          <TextInput id="insigniaNfcCode" {...register("insigniaNfcCode")} />
          {errors.insigniaNfcCode?.message && (
            <ErrorMessage error={errors.insigniaNfcCode.message} />
          )}
        </div>
        <div>
          <label htmlFor="insigniaLogo">Logo de la insignia</label>
          <TextInput id="insigniaLogo" {...register("insigniaLogo")} />
          {errors.insigniaLogo?.message && (
            <ErrorMessage error={errors.insigniaLogo.message} />
          )}
        </div>
        <div className="flex flex-row gap-x-5">
          {defaultValues?.insigniaId && (
            <button
              className="w-full rounded-lg bg-red-500 p-3 text-white"
              onClick={() => {
                deleteInsignia.mutate({
                  id: defaultValues.insigniaId ?? -1,
                });
              }}
            >
              Eliminar insignia
            </button>
          )}
          <button
            className="w-full rounded-lg bg-verde p-3 text-white"
            type="submit"
          >
            {action} insignia
          </button>
        </div>
      </div>
    </form>
  );
};
