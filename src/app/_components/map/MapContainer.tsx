"use client";
import {
    DndContext,
    type DragEndEvent,
    DragOverlay,
    type DragStartEvent,
} from "@dnd-kit/core";

import { useCallback, useEffect, useRef, useState } from "react";
import SwitchButton from "./SwitchButton";
import type { Pin, Zone } from "@prisma/client";
import PinIcon from "./Pin";
import Button from "../Button";
import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";
import Card from "../card/Card";
import { FaEdit } from "react-icons/fa";
import Modal from "../Modal";
import EditPinsModal from "./EditPinsModal";
import { iconDictionary } from "~/utils/icons";

const MapContainer = ({ pinList, zones }: { pinList: Pin[], zones?: Zone[] }) => {
    const divRef = useRef<HTMLDivElement>(null); // Reference for the div
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const updateDimensions = () => {
        if (divRef.current) {
            const { width, height } = divRef.current.getBoundingClientRect();
            setDimensions({ width, height });
        }
    };

    useEffect(() => {
        updateDimensions();
        window.addEventListener("resize", updateDimensions);

        return () => {
            window.removeEventListener("resize", updateDimensions);
        };
    }, []);

    const [pins, setPins] = useState<Pin[]>([]);

    useEffect(() => {
        if (dimensions.width > 0 && dimensions.height > 0) {
            // Recalculate pins when dimensions are updated
            const updatedPins = pinList.map((pin) => ({
                ...pin,
                x: (pin.x * dimensions.width) / 100,
                y: (pin.y * dimensions.height) / 100,
            }));

            setPins(updatedPins);
        }
    }, [dimensions]);


    const [openEdit, setOpenEdit] = useState(false);
    const [selectedPin, setSelectedPin] = useState<Pin>();

    const updatePins = api.pin.updatePins.useMutation({
        onSuccess: async () => {
            toast({
                title: `¡Pines actualizados!`,
                description: `Los pines han sido actualizados correctamente`,
            })
        },
        onError: (error) => {
            toast({
                title: `Error al actualizar los pines`,
                description: error.message || JSON.stringify(error),
            })
        },
    });

    const tag1 = "Piso 1";
    const tag2 = "Piso 2";

    const tags: Record<string, number> = {
        "Piso 1": 1,
        "Piso 2": 2,
    };

    const [variant, setSelected] = useState(tag1);

    const toggleVariant = useCallback(() => {
        setSelected(variant === tag1 ? tag2 : tag1);
    }, [variant]);



    const [activePinId, setActivePinId] = useState<number | null>(null);

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const pinId = parseInt(active.id.toString().replace("pin-", ""), 10);
        setActivePinId(pinId);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, delta } = event;
        const pinId = parseInt(active.id.toString().replace("pin-", ""), 10);

        setPins((prevPins) =>

            prevPins.map((pin) => {
                const x = pin.x + delta.x;
                const y = pin.y + delta.y;

                const boundX = Math.min(Math.max(0, x), dimensions.width - 32);
                const boundY = Math.min(Math.max(0, y), dimensions.height - 32);

                return (
                    pin.id === pinId
                        ? { ...pin, x: boundX, y: boundY }
                        : pin
                );
            })
        );
        setActivePinId(null);
    };

    const handleEdit = (pin: Pin) => {
        setSelectedPin(pin);
        console.log("PIN", pin);
        setOpenEdit(true);
    }

    const { toast } = useToast();
    const handleSave = () => {
        const copyPins = [...pins];
        pins.map((copyPins) => {
            copyPins.x = (copyPins.x / dimensions.width) * 100;
            copyPins.y = (copyPins.y / dimensions.height) * 100;
        })

        updatePins.mutate(copyPins);
        updateDimensions();
    }



    const activePin = pins.find((pin) => pin.id === activePinId);

    return (
        <>
            <div>
                <SwitchButton variant={variant} onClick={toggleVariant} tag1={tag1} tag2={tag2} />
                <div className="py-4 text-base">
                    Arrastra los pines para cambiar su posición y guarda las actualizaciones con el botón guardar posiciones.
                    <br />
                    <div className="flex gap-2 items-center">
                        También puedes editarlos desde la lista haciendo click en el botón de editar.
                        <FaEdit className="text-lg text-azul hover:text-azul-200" />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-6 pt-4 h-max">

                    <div className="w-1/2 border h-auto bg-gray-200 relative">
                        <div ref={divRef}>
                            <img

                                src={variant == tag1 ? "/Mapa_A.png" : "/Mapa_B.png"}
                                alt="Map or Background"
                                className="w-full h-auto object-contain"
                            />
                        </div>

                        <div className="absolute top-0 left-0">

                            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                                {pins.map((pin, key) => (
                                    pin.piso === tags[variant] && (
                                        <PinIcon
                                            key={key}
                                            pin={pin}
                                            isDragging={activePinId === pin.id}
                                            imageRect={dimensions}
                                        />
                                    )
                                ))}

                                <DragOverlay>
                                    {activePin ? (
                                        <div
                                            style={{
                                                backgroundColor: activePin.color,
                                            }}
                                            className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center text-white shadow-lg"
                                        >
                                            {/* {activePin} */}
                                        </div>
                                    ) : null}
                                </DragOverlay>
                            </DndContext>
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-4">
                        {pins.map((pin, key) => (
                            pin.piso === tags[variant] && (

                                <Card key={key}>
                                    <div className="flex flex-row justify-between">
                                        <div className="flex flex-row items-center gap-4">

                                            <div style={{
                                                backgroundColor: pin.color,
                                            }}
                                                className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center text-white shadow-lg">
                                                {iconDictionary[pin.icon]?.icon?.({})}

                                            </div>

                                            <div className="flex flex-col">
                                                <h1 className="font-semibold text-texto"> {pin.name} </h1>
                                                <p className="text-texto"> Piso: {pin.piso} </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-row gap-6">
                                            <div className="items-left flex flex-col justify-center text-sm text-gris">
                                                <div>x: {pin.x.toFixed()}</div>
                                                <div>y: {pin.y.toFixed()}</div>
                                            </div>

                                            <button onClick={() => handleEdit(pin)}>
                                                <FaEdit className="text-lg text-azul hover:text-azul-200" />
                                            </button>
                                        </div>
                                    </div>
                                </Card>
                            )
                        ))}
                    </div>
                </div>


                <p className="text-sm text-slate-500">W: {dimensions.width.toFixed()}px, H: {dimensions.height.toFixed()}px</p>


                <div className="mt-4 flex">
                    <Button label="Guardar posiciones" onClick={handleSave} />
                </div>


            </div>
            {selectedPin && (
                <Modal
                    title={"Editar Pines"}
                    onClose={() => {
                        setOpenEdit(false);
                    }}
                    isOpen={openEdit}
                    customButtonAction={() => setOpenEdit(false)}
                >
                    <EditPinsModal onClose={() => setOpenEdit(false)} pin={selectedPin} zones={zones} />
                </Modal>
            )}
        </>
    )
}

export default MapContainer;