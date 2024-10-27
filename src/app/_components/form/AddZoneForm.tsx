import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { api } from "~/trpc/react";
import { zoneSchema } from "~/lib/schemas";
import { TextInput } from "./TextInput";
import { ErrorMessage } from "./ErrorMessage";
import { useToast } from "~/hooks/use-toast";

type FormData = z.infer<typeof zoneSchema>;

export const AddZoneForm = ({ onCompleted }: { onCompleted: () => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(zoneSchema),
  });
  const { toast } = useToast();
  const utils = api.useUtils();

  const createZone = api.zone.create.useMutation({
    onSuccess: async (data) => {
      toast({
        title: "Zona creada!",
        description: `${data.name} | ${data.createdAt}`,
      });
      await utils.zone.invalidate();
      onCompleted();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    createZone.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="m-3 flex flex-col gap-y-4 text-gris">
        <div>
          <label htmlFor="zoneName">Nombre de la zona</label>
          <TextInput id="zoneName" {...register("zoneName")} />
          {errors.zoneName?.message && (
            <ErrorMessage error={errors.zoneName.message} />
          )}
        </div>
        <div>
          <label htmlFor="zoneDescription">Descripción de la zona</label>
          <TextInput id="zoneDescription" {...register("zoneDescription")} />

          {errors.zoneDescription?.message && (
            <ErrorMessage error={errors.zoneDescription.message} />
          )}
        </div>
        <div>
          <label htmlFor="zoneColor">Color de la zona</label>
          <input className="w-full" type="color" {...register("zoneColor")} />
          {errors.zoneColor?.message && (
            <ErrorMessage error={errors.zoneColor.message} />
          )}
        </div>
        <div>
          <label htmlFor="zoneLogo">Logo de la zona (opcional)</label>
          <TextInput id="zoneLogo" {...register("zoneLogo")} />
          {errors.zoneLogo?.message && (
            <ErrorMessage error={errors.zoneLogo.message} />
          )}
        </div>
        <button className="rounded-lg bg-verde p-3 text-white" type="submit">
          Crear
        </button>
      </div>
    </form>
  );
};
