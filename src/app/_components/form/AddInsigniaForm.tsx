import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { api } from "~/trpc/react";
import { existingInsigniaSchema } from "~/lib/schemas";
import { TextInput } from "./TextInput";
import { ErrorMessage } from "./ErrorMessage";
import { useToast } from "~/hooks/use-toast";

type FormData = z.infer<typeof existingInsigniaSchema>;

export const AddInsigniaForm = ({
  onCompleted,
  defaultValues,
  zone_id = undefined,
  event_id = undefined,
}: {
  onCompleted: () => void;
  defaultValues?: FormData;
  zone_id?: number | undefined | null;
  event_id?: number | undefined;
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(existingInsigniaSchema),
    defaultValues: {
      insigniaDescription: defaultValues?.insigniaDescription,
      insigniaId: defaultValues?.insigniaId,
      insigniaLogo: defaultValues?.insigniaLogo,
      insigniaName: defaultValues?.insigniaName,
      insigniaNfcCode: defaultValues?.insigniaNfcCode,
      insigniaSpecialEventId: defaultValues?.insigniaSpecialEventId ?? event_id,
      zone_id:
        defaultValues?.zone_id ?? (zone_id === undefined ? null : zone_id),
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
      toast({
        title: "Ocurrió un error.",
        description: `${error.message}`,
      });
      console.error(error);
    },
  });

  const deleteInsignia = api.insignia.delete.useMutation({
    onSuccess: async (data) => {
      toast({
        title: "Insignia Borrada!",
        description: `Nombre: ${data.name}}`,
      });
      await utils.insignia.invalidate();
      onCompleted();
    },
    onError: (error) => {
      toast({
        title: "Ocurrió un error.",
        description: `${error.message}`,
      });
      console.error(error);
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log("we are trying to create an insignia with this data: ");
    console.log(data);
    if (createInsignia.isIdle) createInsignia.mutate(data);
  };

  console.log("hello");
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
          <label htmlFor="insigniaLogo">
            Logo de la insignia (subir imagen o escribir link)
          </label>
          <TextInput id="insigniaLogo" {...register("insigniaLogo")} />
          {errors.insigniaLogo?.message && (
            <ErrorMessage error={errors.insigniaLogo.message} />
          )}
          <input
            className="my-3"
            type="file"
            name="file"
            accept=".jpg, .jpeg, .png"
            onChange={(e) => {
              if (!e.target.files) return;
              const file = e.target.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onloadend = async () => {
                if (typeof reader.result === "string") {
                  setValue("insigniaLogo", reader.result);
                }
              };
            }}
          />
          {watch("insigniaLogo") && (
            <img
              src={watch("insigniaLogo")}
              alt="Logo de la insignia"
              className="mx-auto w-64 pt-3"
            />
          )}
        </div>
        <div className="flex flex-row gap-x-5">
          {defaultValues?.insigniaId && (
            <button
              className="w-full rounded-lg bg-red-500 p-3 text-white"
              type="button"
              onClick={() => {
                if (deleteInsignia.isIdle) {
                  deleteInsignia.mutate({
                    id: defaultValues.insigniaId ?? -1,
                  });
                }
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
