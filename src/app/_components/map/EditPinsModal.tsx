"use client";
import type { Pin, Zone } from "@prisma/client";
import Button from "../Button";
import AddButton from "../form/AddButton";
import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";
import { useEffect, useState } from "react";
import IconSelector from "./IconSelector";
import { iconDictionary } from "../../../utils/icons";
interface EditPinsModalProps {
    onClose: () => void;
    pin: Pin;
    zones?: Zone[];
}

const EditPinsModal = ({ onClose, pin, zones }: EditPinsModalProps) => {
    const {
        handleSubmit,
        register,
        setValue,
        reset,
        formState: { errors },
    } = useForm<Pin>({ defaultValues: {
        name: pin.name,
        color: pin.color,
        icon: pin.icon,
        piso: pin.piso,
    } });

    const [selected, setSelected] = useState(iconDictionary[pin.icon]?.value ?? "Sin seleccionar");
    
    useEffect(() => {
        reset({
            name: pin.name,
            color: pin.color,
            icon: pin.icon,
            piso: pin.piso,
        });
        setSelected(iconDictionary[pin.icon]?.value ?? "Sin seleccionar");
    }, [pin, reset]);

    const handleIconSelect = (value: string) => {
        setSelected(value);
        setValue("icon", value, { shouldValidate: true });
    };

    const { toast } = useToast();
    console.log("editing", pin)
    const utils = api.useUtils();

    const editPin = api.pin.updatePin.useMutation({
        onSuccess: async (data) => {
            toast({
                title: `¡Pin actualizado!`,
                description: `${data.name}`,
            });
            await utils.pin.invalidate();
        },
        onError: (error) => {
            toast({
                title: `Error al actualizar el pin`,
                description: error.message || JSON.stringify(error),
            })
        },
    });
    const deletePin = api.pin.deletePin.useMutation({
        onSuccess: async (data) => {
            toast({
                title: `¡Pin eliminado!`,
                description: `${data.name}`,
            })
            await utils.pin.invalidate();
        },
        onError: (error) => {
            toast({
                title: `Error al eliminar el pin`,
                description: error.message || JSON.stringify(error),
            })
        },
    });


    const handleDelete = () => {
        if (window.confirm("¿Estás seguro que deseas eliminar este pin?")) {
            deletePin.mutate(pin.id);
            onClose();
        }
    };

    const onSubmit: SubmitHandler<Pin> = (data) => {
        console.log(data)
        editPin.mutate({
            id: pin.id,
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
        <div className="flex w-full flex-col px-4 pb-4 z-50">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex w-full flex-col pb-4">
                    <label>Nombre del pin</label>
                    <input
                        id="nombre"
                        // defaultValue={pin.name}
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
                            defaultChecked={pin.piso === 1}
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
                            defaultChecked={pin.piso === 2}
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
                        defaultValue={pin.color}
                        className="rounded-md border-2 px-1"
                        {...register("color")}
                        required
                    />
                </div>

                <div className="flex flex-col pb-6">
                    <label>Ícono</label>
                    <IconSelector selected={selected} setSelected={handleIconSelect} />
                    {errors.icon && <p className="text-red-500">{errors.icon.message}</p>}
                </div>


                <div className="flex flex-row justify-end gap-4">
                    <Button label="Eliminar" onClick={handleDelete} danger full />
                    <Button submit label="Guardar" full />
                </div>
            </form>
        </div>
    );
}

export default EditPinsModal;