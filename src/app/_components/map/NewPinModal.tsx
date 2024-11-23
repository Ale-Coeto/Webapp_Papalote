import { Pin, SpecialEvent } from "@prisma/client";
import Button from "../Button";
import AddButton from "../form/AddButton";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";

const NewPinModal = ({ onClose }: { onClose: () => void }) => {
    const {
        handleSubmit,
        register,
        setValue,
        formState: { errors },
    } = useForm<Pin>({ defaultValues: {} });

    const { toast } = useToast();

    const addPin = api.pin.createPin.useMutation({
        onSuccess: async (data) => {
            toast({
                title: `¡Pin creado!`,
                description: `${data.name}`,
            })
        },
        onError: (error) => {
            toast({
                title: `Error al crear el pin`,
                description: `${error}`,
            })
        },
    });
    

    const onSubmit: SubmitHandler<Pin> = (data: Pin) => {
        addPin.mutate({
            name: data.name ?? "",
            color: data.color ?? "",
            icon: data.icon ?? "",
            piso: Number(data.piso) ?? 1,
        });

        setValue("name", "");
        setValue("color", "");
        setValue("icon", "");
        setValue("piso", 1);
        onClose();
    };

    return (
        <div className="flex w-full flex-col px-4 pb-4 z-10">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex w-full flex-col pb-6">
                    <label>Nombre</label>
                    <input
                        id="nombre"
                        type="text"
                        className="w-full rounded-md border-2 px-1"
                        {...register("name")}
                        required
                    />
                </div>

                <div className="flex flex-col pb-6">
                    <label>Piso</label>
                    <div className="flex gap-2">
                        <input
                            id="color"
                            type="radio"
                            value={1}
                            className="rounded-md border-2 px-1"
                            {...register("piso")}
                            required
                        />
                        Piso 1
                        <input
                            id="color"
                            type="radio"
                            value={2}
                            className="rounded-md border-2 px-1 ml-6"
                            {...register("piso")}
                            required
                        />
                        Piso 2
                    </div>
                </div>

                <div className="flex flex-col pb-6">
                    <label>Color</label>
                    <input
                        id="color"
                        type="color"
                        className="rounded-md border-2 px-1"
                        {...register("color")}
                        required
                    />
                </div>

                <div className="flex flex-col pb-6">
                    <label>Ícono</label>
                    <div className="flex flex-row pt-1">
                        <AddButton onClick={onClose} />
                    </div>
                </div>

                <Button submit label="Agregar" full />
            </form>
        </div>
    );
}

export default NewPinModal;