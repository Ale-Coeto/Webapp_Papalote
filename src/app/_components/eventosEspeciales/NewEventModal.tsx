import { SpecialEvent } from "@prisma/client";
import Button from "../Button";
import AddButton from "../forms/AddButton";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/trpc/react";



export default function NewEventModal({ onClose }: { onClose: () => void }) {
    const { handleSubmit, register, setValue, formState: { errors } } = useForm<SpecialEvent>({ defaultValues: {  } });
    const addEvent = api.specialEventRouter.createSpecialEvent.useMutation();

    const onSubmit: SubmitHandler<SpecialEvent> = (data: SpecialEvent) => {

        addEvent.mutate({
            name: data.name ?? "",
            description: data.description ?? "",
            startDate: new Date(data.start_date) ?? new Date(),
            endDate: new Date(data.end_date) ?? new Date(),
            image: "data.infografia"
        });

        setValue("name", "");
        setValue("description", "");
        setValue("start_date", new Date());
        setValue("end_date", new Date());
        setValue("image", "");

        onClose();
    }


    return (
        <div className="w-full flex flex-col pb-4 px-4">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col pb-4 w-full">
                    <label>Nombre del evento</label>
                    <input id="nombre" type="text" className="border-2 rounded-md px-1 w-full" {...register("name")} required />
                </div>

                <div className="flex flex-col pb-6">
                    <label>Fecha Inicio</label>
                    <input id="fechaInicio" type="date" className="border-2 rounded-md px-1" {...register("start_date")} required/>
                </div>

                <div className="flex flex-col pb-6">
                    <label>Fecha Fin</label>
                    <input id="fechaFin" type="date" className="border-2 rounded-md px-1" {...register("end_date")} required/>
                </div>

                <div className="flex flex-col pb-6">
                    <label>Descripción</label>
                    <textarea id="descripcion" className="border-2 rounded-md px-1" {...register("description")} required/>
                </div>

                <div className="flex flex-col pb-6">
                    <label>Infografía</label>
                    <input id="infografia" type="file" className="" accept=".jpg, .jpeg, .png" {...register("image")} />
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
    )
}