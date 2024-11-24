import type { SpecialEvent } from "@prisma/client";
import Button from "../Button";
import AddButton from "../form/AddButton";
import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/trpc/react";

export default function NewEventModal({ onClose }: { onClose: () => void }) {
  const {
    handleSubmit,
    register,
    setValue,
  } = useForm<SpecialEvent>({ defaultValues: {} });
  const addEvent = api.specialEvent.createSpecialEvent.useMutation();

  const onSubmit: SubmitHandler<SpecialEvent> = (data: SpecialEvent) => {
    addEvent.mutate({
      name: data.name ?? "",
      description: data.description ?? "",
      startDate: new Date(data.start_date) ?? new Date(),
      endDate: new Date(data.end_date) ?? new Date(),
      image: "data.infografia",
    });

    setValue("name", "");
    setValue("description", "");
    setValue("start_date", new Date());
    setValue("end_date", new Date());
    setValue("image", "");

    onClose();
  };

  return (
    <div className="flex w-full flex-col px-4 pb-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex w-full flex-col pb-4">
          <label>Nombre del evento</label>
          <input
            id="nombre"
            type="text"
            className="w-full rounded-md border-2 px-1"
            {...register("name")}
            required
          />
        </div>

        <div className="flex flex-col pb-6">
          <label>Fecha Inicio</label>
          <input
            id="fechaInicio"
            type="date"
            className="rounded-md border-2 px-1"
            {...register("start_date")}
            required
          />
        </div>

        <div className="flex flex-col pb-6">
          <label>Fecha Fin</label>
          <input
            id="fechaFin"
            type="date"
            className="rounded-md border-2 px-1"
            {...register("end_date")}
            required
          />
        </div>

        <div className="flex flex-col pb-6">
          <label>Descripción</label>
          <textarea
            id="descripcion"
            className="rounded-md border-2 px-1"
            {...register("description")}
            required
          />
        </div>

        <div className="flex flex-col pb-6">
          <label>Infografía</label>
          <input
            id="infografia"
            type="file"
            className=""
            accept=".jpg, .jpeg, .png"
            {...register("image")}
          />
        </div>

        <div className="flex flex-col pb-6">
          <label>Insignias</label>
          <div className="flex flex-row pt-1">
            <AddButton onClick={onClose} />
          </div>
        </div>
        <Button submit label="Agregar" full />
      </form>
    </div>
  );
}
