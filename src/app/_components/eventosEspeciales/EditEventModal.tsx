import { SpecialEvent } from "@prisma/client";
import Button from "../Button";
import AddButton from "../form/AddButton";
import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/trpc/react";

interface EditEventModalProps {
  onClose: () => void;
  event: SpecialEvent;
}

export default function EditEventModal({
  onClose,
  event,
}: EditEventModalProps) {
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<SpecialEvent>({ defaultValues: {} });
  const editEvent = api.specialEventRouter.updateSpecialEvent.useMutation();
  const deleteEvent = api.specialEventRouter.deleteSpecialEvent.useMutation();
  const startDate = event.start_date.toISOString().slice(0, 10);
  const endDate = event.end_date.toISOString().slice(0, 10);

  const handleDelete = () => {
    if (window.confirm("¿Estás seguro que deseas eliminar este evento?")) {
      deleteEvent.mutate(event.id);
      onClose();
    }
  };

  const onSubmit: SubmitHandler<SpecialEvent> = (data) => {
    editEvent.mutate({
      id: event.id,
      name: data.name,
      description: data.description,
      startDate: new Date(data.start_date),
      endDate: new Date(data.end_date),
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
            defaultValue={event.name}
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
            defaultValue={startDate}
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
            defaultValue={endDate}
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
            defaultValue={event.description}
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
        <div className="flex flex-row justify-end gap-4">
          <Button label="Eliminar" onClick={handleDelete} danger full />
          <Button submit label="Guardar" full />
        </div>
      </form>
    </div>
  );
}
