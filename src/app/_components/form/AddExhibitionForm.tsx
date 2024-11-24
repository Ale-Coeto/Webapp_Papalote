import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { api } from "~/trpc/react";
import { existingExhibitionSchema } from "~/lib/schemas";
import { TextInput } from "./TextInput";
import { ErrorMessage } from "./ErrorMessage";
import { useToast } from "~/hooks/use-toast";

type FormData = z.infer<typeof existingExhibitionSchema>;

export const AddExhbitionForm = ({
  onCompleted,
  defaultValues,
  zone_id,
}: {
  onCompleted: () => void;
  defaultValues?: FormData;
  zone_id: number | undefined;
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(existingExhibitionSchema),
    defaultValues: {
      exhibitionDescription: defaultValues?.exhibitionDescription,
      exhibitionId: defaultValues?.exhibitionId,
      exhibitionImage: defaultValues?.exhibitionImage,
      exhibitionName: defaultValues?.exhibitionName,
      exhibitionIsOpen: defaultValues?.exhibitionIsOpen,
      zone_id: defaultValues?.zone_id ?? zone_id,
    },
  });

  const { toast } = useToast();
  const utils = api.useUtils();

  const action = defaultValues ? "Modificar" : "Crear";
  const verb = defaultValues ? "modificada" : "creada";

  const createExhibition = api.exhibition.createOrModify.useMutation({
    onSuccess: async (data) => {
      toast({
        title: `Exhibición ${verb}!`,
        description: `Nombre: ${data.name}`,
      });
      await utils.exhibition.invalidate();
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

  const deleteExhibition = api.exhibition.delete.useMutation({
    onSuccess: async (data) => {
      toast({
        title: "Exhibición Borrada!",
        description: `Nombre: ${data.name}`,
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

  const onSubmit: SubmitHandler<FormData> = (data) => {
    createExhibition.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="m-3 flex flex-col gap-y-4 text-gris">
        <div>
          <label htmlFor="exhibitionName">Nombre de la exhibición</label>
          <TextInput id="exhibitionName" {...register("exhibitionName")} />
          {errors.exhibitionName?.message && (
            <ErrorMessage error={errors.exhibitionName.message} />
          )}
        </div>
        <div>
          <label htmlFor="exhibitionDescription">
            Descripción de la exhibición
          </label>
          <TextInput
            id="exhibitionDescription"
            {...register("exhibitionDescription")}
          />

          {errors.exhibitionDescription?.message && (
            <ErrorMessage error={errors.exhibitionDescription.message} />
          )}
        </div>
        <div className="flex flex-row items-center gap-x-4 gap-y-4">
          <label htmlFor="exhibitionIsOpen">Exhibición abierta</label>
          <TextInput
            id="exhibitionIsOpen"
            type="checkbox"
            className="h-5 w-5"
            {...register("exhibitionIsOpen")}
          />

          {errors.exhibitionIsOpen?.message && (
            <ErrorMessage error={errors.exhibitionIsOpen.message} />
          )}
        </div>

        <div>
          <label htmlFor="exhibitionImage">
            Imagen de la exhibición (subir imagen o escribir link)
          </label>
          <TextInput id="exhibitionImage" {...register("exhibitionImage")} />
          {errors.exhibitionImage?.message && (
            <ErrorMessage error={errors.exhibitionImage.message} />
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
                  setValue("exhibitionImage", reader.result);
                }
              };
            }}
          />
          {watch("exhibitionImage") && (
            <img
              src={watch("exhibitionImage")}
              alt="Logo de la exhibición"
              className="mx-auto w-64 pt-3"
            />
          )}
        </div>
        <div className="flex flex-row gap-x-5">
          <button
            className="w-full rounded-lg bg-verde p-3 text-white"
            type="submit"
          >
            {action} exhibición
          </button>
          {defaultValues?.exhibitionId && (
            <button
              className="w-full rounded-lg bg-red-500 p-3 text-white"
              onClick={() => {
                deleteExhibition.mutate({
                  id: defaultValues.exhibitionId ?? -1,
                });
              }}
            >
              Eliminar exhibición
            </button>
          )}
        </div>
      </div>
    </form>
  );
};
