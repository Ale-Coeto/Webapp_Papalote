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
import { useCallback, useState } from "react";
import SwitchButton from "./SwitchButton";
import { Pin } from "@prisma/client";
import PinIcon from "./Pin";
import Button from "../Button";
import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";


const MapContainer = ({ pinList }: { pinList: Pin[] }) => {
    const [pins, setPins] = useState<Pin[]>(pinList);

    const updatePins = api.pin.updatePins.useMutation();

    const tag1 = "Piso 1";
    const tag2 = "Piso 2";
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

                const boundX = Math.min(Math.max(0, x), 600-32);
                const boundY = Math.min(Math.max(0, y), 500-32);

                return (
                    pin.id === pinId
                        ? { ...pin, x: boundX, y: boundY }
                        : pin
                );
            })
        );
        setActivePinId(null);
    };

    const toast = useToast();
    const handleSave = () => {
        //save and toast
        updatePins.mutate(pins)
        // toast({
        //     title: "Pins actualizados",
        //     description: "Los pins han sido actualizados correctamente",
        // });
        console.log(pins);
    }

    const activePin = pins.find((pin) => pin.id === activePinId);

    return (
        <div>
            <SwitchButton variant={variant} onClick={toggleVariant} tag1={tag1} tag2={tag2} />

            <div className="relative w-[600px] h-[500px] border bg-gray-200">

                <img
                    src="/Papalote.png"
                    alt="Map or Background"
                    className="absolute w-full h-full object-cover"
                />

                <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                    {pins.map((pin) => (
                        <PinIcon
                            key={pin.id}
                            id={pin.id}
                            x={pin.x}
                            y={pin.y}
                            color={pin.color}
                            isDragging={activePinId === pin.id}
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

                <div className="absolute bottom-4 left-4 bg-white p-2 shadow rounded max-w-xs">
                    <p>Pin Coordinates:</p>
                    <ul>
                        {pins.map((pin) => (
                            <li key={pin.id}>
                                Pin {pin.id}: X: {pin.x}, Y: {pin.y}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="mt-4">
                <Button label="Guardar" onClick={handleSave} />
            </div>
        </div>
    )
}

export default MapContainer;