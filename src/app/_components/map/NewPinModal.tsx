import { Pin, Zone } from "@prisma/client";
import Button from "../Button";
import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";
import { useState } from "react";
import IconSelector from "./IconSelector";
import ZoneSelector from "./ZoneSelector";

const NewPinModal = ({ onClose, zones }: { onClose: () => void, zones?: Zone[] }) => {
    const [selected, setSelected] = useState("Sin seleccionar");
    const [selectedZone, setSelectedZone] = useState<number>(-1);

    const handleIconSelect = (value: string) => {
        setSelected(value);
        setValue("icon", value, { shouldValidate: true });
    };

    const handleZoneSelect = (value: number) => {
        setSelectedZone(value);
        setValue("zone_id", value);
    };

    const {
        handleSubmit,
        register,
        setValue,
        formState: { errors },
    } = useForm<Pin>({ defaultValues: {} });

    const { toast } = useToast();
    const utils = api.useUtils();

    const addPin = api.pin.createPin.useMutation({
        onSuccess: async (data) => {
            toast({
                title: `¡Pin creado!`,
                description: `${data.name}`,
            });
            await utils.pin.invalidate();
        },
        onError: (error) => {
            toast({
                title: `Error al crear el pin`,
                description: error.message || JSON.stringify(error),
            })
        },
    });


    const onSubmit: SubmitHandler<Pin> = (data: Pin) => {
        addPin.mutate({
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
        setValue("zone_id", -1);
        onClose();
        setSelected("Sin seleccionar");
        setSelectedZone(-1);
    };

    return (
        <div className="flex w-full flex-col px-4 pb-4 z-50 ">
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


                <Button submit label="Agregar" full />
            </form>
        </div>
    );
}

export default NewPinModal;