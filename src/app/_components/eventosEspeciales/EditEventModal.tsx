import { SpecialEvent } from "@prisma/client";
import Button from "../Button";
import AddButton from "../forms/AddButton";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/trpc/react";

interface EditEventModalProps {
    onClose: () => void;
    event: SpecialEvent;
}

export default function EditEventModal({ onClose, event }: EditEventModalProps) {
    const { handleSubmit, register, setValue, formState: { errors } } = useForm<FieldValues>({ defaultValues: { title: '', content: '' } });
    const editEvent = api.specialEventRouter.updateSpecialEvent.useMutation();
    const deleteEvent = api.specialEventRouter.deleteSpecialEvent.useMutation();
    const startDate = event.start_date.toISOString().slice(0, 10);
    const endDate = event.end_date.toISOString().slice(0, 10);

    const handleDelete = () => {
        if (window.confirm("¿Estás seguro que deseas eliminar este evento?")) {
            deleteEvent.mutate(event.id);
            onClose();
        }
    }

    const onSubmit: SubmitHandler<FieldValues> = (data) => {

        editEvent.mutate({
            id: event.id,
            name: data.nombre,
            description: data.descripcion,
            startDate: new Date(data.fechaInicio),
            endDate: new Date(data.fechaFin),
            image: "data.infografia"
        });

        setValue("nombre", "");
        setValue("descripcion", "");
        setValue("fechaInicio", "");
        setValue("fechaFin", "");
        setValue("infografia", "");

        onClose();
    }


    return (
        <div className="w-full flex flex-col pb-4 px-4">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col pb-4 w-full">
                    <label>Nombre del evento</label>
                    <input id="nombre" defaultValue={event.name} type="text" className="border-2 rounded-md px-1 w-full" {...register("nombre")} required />
                </div>

                <div className="flex flex-col pb-6">
                    <label>Fecha Inicio</label>
                    <input id="fechaInicio" defaultValue={startDate} type="date" className="border-2 rounded-md px-1" {...register("fechaInicio")} required/>
                </div>

                <div className="flex flex-col pb-6">
                    <label>Fecha Fin</label>
                    <input id="fechaFin" defaultValue={endDate} type="date" className="border-2 rounded-md px-1" {...register("fechaFin")} required/>
                </div>

                <div className="flex flex-col pb-6">
                    <label>Descripción</label>
                    <textarea id="descripcion" defaultValue={event.description} className="border-2 rounded-md px-1" {...register("descripcion")} required/>
                </div>

                <div className="flex flex-col pb-6">
                    <label>Infografía</label>
                    <input id="infografia" type="file" className="" accept=".jpg, .jpeg, .png" {...register("infografia")} />
                </div>

                <div className="flex flex-col pb-6">
                    <label>Insignias</label>
                    <div className="flex flex-row pt-1">

                        <AddButton onClick={() => { }} />
                    </div>
                </div>
                <div className="flex flex-row justify-end gap-4">

                <Button label="Eliminar" onClick={handleDelete} danger full />
                <Button submit label="Guardar" full />
                </div>
            </form>
        </div>
    ) 
}