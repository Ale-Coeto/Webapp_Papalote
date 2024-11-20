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
import Pin from "./Pin";

interface Pin {
    id: number;
    x: number;
    y: number;
}
const MapContainer = ({ pinList }: { pinList: Pin[] }) => {
    const [pins, setPins] = useState<Pin[]>(pinList);

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
            prevPins.map((pin) =>
                pin.id === pinId
                    ? { ...pin, x: pin.x + delta.x, y: pin.y + delta.y }
                    : pin
            )
        );
        setActivePinId(null); // Reset active pin
    };

    const activePin = pins.find((pin) => pin.id === activePinId);

    return (
        <div>
            <SwitchButton variant={variant} onClick={toggleVariant} tag1={tag1} tag2={tag2} />

            <div className="relative w-full h-[500px] border bg-gray-200">

                <img
                    src="/Papalote.png"
                    alt="Map or Background"
                    className="absolute w-full h-full object-cover"
                />

                <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                    {pins.map((pin) =>
                        activePinId === pin.id ? null : (
                            <Pin key={pin.id} id={pin.id} x={pin.x} y={pin.y} />
                        )
                    )}

                    {/* Drag Overlay */}
                    <DragOverlay>
                        {activePin ? (
                            <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center text-white shadow-lg">
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
        </div>
    )
}

export default MapContainer;