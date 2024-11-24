"use client";
import {
    closestCorners,
    DndContext,
    type DragEndEvent,
    type DragOverEvent,
    DragOverlay,
    type DragStartEvent,
    MouseSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";

import { useCallback, useEffect, useRef, useState } from "react";
import SwitchButton from "./SwitchButton";
import { Pin } from "@prisma/client";
import PinIcon from "./Pin";
import Button from "../Button";
import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";
import Card from "../card/Card";
import { FaEdit } from "react-icons/fa";
import Modal from "../Modal";
import NewPinModal from "./NewPinModal";
import EditPinsModal from "./EditPinsModal";


const MapContainer = ({ pinList }: { pinList: Pin[] }) => {
    const divRef = useRef<HTMLDivElement>(null); // Reference for the div
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const updateDimensions = () => {
        if (divRef.current) {
            const { width, height } = divRef.current.getBoundingClientRect();
            setDimensions({ width, height });
        }
    };
    useEffect(() => {
        if (dimensions.width > 0 && dimensions.height > 0) {
            const updatedPins = pinList.map((pin) => ({
                ...pin,
                x: (pin.x * dimensions.width) / 100,
                y: (pin.y * dimensions.height) / 100,
            }));
            if (updatedPins) {
                setPins(updatedPins);
            }
        }
        console.log("Pins", pins)
    }, [pinList, dimensions]);

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
    }, [pinList, dimensions]);


    const [openEdit, setOpenEdit] = useState(false);
    const [selectedPin, setSelectedPin] = useState<Pin>();
    const [refreshKey, setRefreshKey] = useState(0);

    const updatePins = api.pin.updatePins.useMutation({
        onSuccess: async (data) => {
            toast({
                title: `¡Pines actualizados!`,
                description: `Los pines han sido actualizados correctamente`,
            })
            setRefreshKey((prev) => prev + 1);
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
        setPins(pinList);
        updateDimensions();
    }



    const activePin = pins.find((pin) => pin.id === activePinId);

    return (
        <>
            <div>
                <SwitchButton variant={variant} onClick={toggleVariant} tag1={tag1} tag2={tag2} />
                <p>Width: {dimensions.width}px</p>
                <p>Height: {dimensions.height}px</p>
                <div className="flex flex-col md:flex-row gap-6 pt-4 h-max">
                    <div ref={divRef} className="w-1/2 border bg-gray-200 relative">

                        <img
                            src="/Mapa_A.png"
                            alt="Map or Background"
                            className="w-full h-auto object-contain"
                        />

                        <div className="absolute top-0 left-0" key={refreshKey}>

                            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                                {pins.map((pin) => (
                                    <PinIcon
                                        key={pin.id}
                                        id={pin.id}
                                        x={pin.x}
                                        y={pin.y}
                                        color={pin.color}
                                        isDragging={activePinId === pin.id}
                                        imageRect={dimensions}
                                    />
                                ))}

                                <DragOverlay>
                                    {activePin ? (
                                        <div
                                            style={{
                                                backgroundColor: activePin.color,
                                            }}
                                            className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center text-white shadow-lg"
                                        >
                                            {activePin.id}
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
                                        <div className="flex flex-col">
                                            <h1 className="font-semibold text-texto"> {pin.name} </h1>
                                            <p className="text-texto"> Piso: {pin.piso} </p>
                                        </div>
                                        <div className="flex flex-row gap-6">
                                            <div className="items-left flex flex-col justify-center text-sm text-gris">
                                                <div>x: {pin.x}</div>
                                                <div>y: {pin.y}</div>
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
                    <EditPinsModal onClose={() => setOpenEdit(false)} pin={selectedPin} />
                </Modal>
            )}
        </>
    )
}

export default MapContainer;