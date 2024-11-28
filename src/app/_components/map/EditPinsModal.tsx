"use client";
import type { Pin, Zone } from "@prisma/client";
import Button from "../Button";
import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";
import { useEffect, useState } from "react";
import IconSelector from "./IconSelector";
import { iconDictionary } from "../../../utils/icons";
import ZoneSelector from "./ZoneSelector";

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
    } = useForm<Pin>({
        defaultValues: {
            name: pin.name,
            color: pin.color,
            icon: pin.icon,
            piso: pin.piso ?? 1,
            zone_id: pin.zone_id,
        }
    });

    const [selected, setSelected] = useState(iconDictionary[pin.icon]?.value ?? "Sin seleccionar");
    const [selectedZone, setSelectedZone] = useState<number>(pin.zone_id ?? -1);

    useEffect(() => {
        console.log("Default piso value:", pin.piso);
        reset({
            name: pin.name,
            color: pin.color,
            icon: pin.icon,
            piso: pin.piso,
            zone_id: pin.zone_id,
        });
        setValue("piso", pin.piso ?? 1);
        setSelected(iconDictionary[pin.icon]?.value ?? "Sin seleccionar");
        setSelectedZone(pin.zone_id ?? -1);
    }, [pin, reset]);

    const handleIconSelect = (value: string) => {
        setSelected(value);
        setValue("icon", value, { shouldValidate: true });
    };

    const { toast } = useToast();
    const utils = api.useUtils();
    const handleZoneSelect = (value: number) => {
        setSelectedZone(value);
        setValue("zone_id", value);
    };

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
    
    const onSubmit: SubmitHandler<Pin> = (data) => {
        editPin.mutate({
            id: pin.id,
            name: data.name ?? "",
            color: data.color ?? "",
            icon: data.icon ?? "",
            piso: Number(data.piso) ?? 1,
            zone_id: data.zone_id !== -1 && data.zone_id !== null ? data.zone_id : undefined,
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
                        type="text"
                        className="w-full rounded-md border-2 px-1"
                        {...register("name")}
                        required
                    />
                </div>

                <div className="flex flex-col pb-6">
                    <label>Piso</label>
                    <div className="flex gap-2" key={pin.id}>
                        <input
                            id="piso1"
                            defaultChecked={pin.piso == 1}
                            type="radio"
                            value={1}
                            className="rounded-md border-2 px-1"
                            {...register("piso", {
                                required: true,
                                setValueAs: (v:string) => parseInt(v, 10),
                            })}
                            required
                        />
                        Piso 1
                        <input
                            id="piso2"
                            type="radio"
                            value={2}
                            defaultChecked={pin.piso == 2}
                            className="rounded-md border-2 px-1 ml-6"
                            {...register("piso", {
                                required: true,
                                setValueAs: (v:string) => parseInt(v, 10),
                            })}
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

                {zones && (
                    <>
                        <div className="flex flex-col pb-6">
                            <label>Zona (opcional)</label>
                            <ZoneSelector selected={selectedZone} setSelected={handleZoneSelect} zones={zones} />
                            {errors.icon && <p className="text-red-500">{errors.icon.message}</p>}
                        </div>
                    </>
                )}


                <div className="flex flex-row justify-end gap-4">
                    {/* <Button label="Eliminar" onClick={handleDelete} danger full /> */}
                    <Button submit label="Guardar" full />
                </div>
            </form>
        </div>
    );
}

export default EditPinsModal;