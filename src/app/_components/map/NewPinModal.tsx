import { Pin, SpecialEvent } from "@prisma/client";
import Button from "../Button";
import AddButton from "../form/AddButton";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/trpc/react";

const NewPinModal = ({ onClose }: { onClose: () => void }) => {
    const {
        handleSubmit,
        register,
        setValue,
        formState: { errors },
    } = useForm<Pin>({ defaultValues: {} });
    // const addEvent = api.Pin.createPin.useMutation();

    const onSubmit: SubmitHandler<Pin> = (data: Pin) => {
        // addEvent.mutate({
        //     color: data.color ?? "",
        //     x: data.x ?? 0,
        //     y: data.y ?? 0,
        //     icon: "data.image",
        // });

        setValue("name", "");
        setValue("color", "");
        setValue("icon", "");
        onClose();
    };

    return (
        <div className="flex w-full flex-col px-4 pb-4">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex w-full flex-col pb-4">
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