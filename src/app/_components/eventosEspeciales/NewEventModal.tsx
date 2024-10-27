import Button from "../Button";
import AddButton from "../forms/AddButton";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/trpc/react";


export default function NewEventModal({ onClose }: { onClose: () => void }) {
    const { handleSubmit, register, setValue, formState: { errors } } = useForm<FieldValues>({ defaultValues: { title: '', content: '' } });
    const addEvent = api.specialEventRouter.createSpecialEvent.useMutation();

    const onSubmit: SubmitHandler<FieldValues> = (data) => {

        addEvent.mutate({
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
                    <input id="nombre" type="text" className="border-2 rounded-md px-1 w-full" {...register("nombre")} required />
                </div>

                <div className="flex flex-col pb-6">
                    <label>Fecha Inicio</label>
                    <input id="fechaInicio" type="date" className="border-2 rounded-md px-1" {...register("fechaInicio")} required/>
                </div>

                <div className="flex flex-col pb-6">
                    <label>Fecha Fin</label>
                    <input id="fechaFin" type="date" className="border-2 rounded-md px-1" {...register("fechaFin")} required/>
                </div>

                <div className="flex flex-col pb-6">
                    <label>Descripción</label>
                    <textarea id="descripcion" className="border-2 rounded-md px-1" {...register("descripcion")} required/>
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
                <Button submit label="Agregar" full />
            </form>
        </div>
    )
}