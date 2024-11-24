import React from "react";
import {
    useDraggable,
} from "@dnd-kit/core";
import type { Pin } from "@prisma/client";
import { iconDictionary } from "../../../utils/icons";


interface PinProps {
    pin: Pin;
    isDragging: boolean;
    // imageRect: { width: number; height: number };
    scale: number;
    // onDragEnd: (id: number, x: number, y: number) => void;
}

const PinIcon: React.FC<PinProps> = ({ pin, isDragging, scale }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: `pin-${pin.id}`,
    });

    const iconData = iconDictionary[pin.icon];
    const IconComponent = iconData?.icon;
    //339 304
    // const scaleX = imageRect.width / 1474; // Assume 1000 is the original width
    // const scaleY = imageRect.height / 1322; // Assume 800 is the original height
    // const scale = Math.min(scaleX, scaleY);
    const baseSize = 80; // Base pin size in pixels (matches w-20 h-20)
    const pinSize = baseSize * scale; // Adjust pin size based on scale

    const style: React.CSSProperties = {
        position: "absolute",
        top: pin.y - pinSize / 2, // Center the pin
        left: pin.x - pinSize / 2, // Center the pin
        width: `${pinSize}px`, // Apply dynamic width
        height: `${pinSize}px`, // Apply dynamic height
        cursor: "grab",
        opacity: isDragging ? 0 : 1,
        pointerEvents: isDragging ? "none" : "auto",
        transformOrigin: "center",
    };
    // const style: React.CSSProperties = {
    //     position: "absolute",
    //     top: pin.y, // Already scaled in setPins
    //     left: pin.x, // Already scaled in setPins
    //     cursor: "grab",
    //     opacity: isDragging ? 0 : 1,
    //     pointerEvents: isDragging ? "none" : "auto",
    //     transform: `scale(${scale})`, // Apply scaling to pin size
    //     transformOrigin: "center",
    // };

    return (

        <div className="z-10  w-auto">

            <div className="absolute bg-red-500" style={{ ...style, }}>
                <div
                    ref={setNodeRef}
                    {...listeners}
                    {...attributes}
                    style={{
                        backgroundColor: pin.color,
                        width: `${pinSize}px`, // Circle width
                        height: `${pinSize}px`, // Circle height
                        borderWidth: `${2 * scale}px`, // Scale border thickness
                    }}
                    className="rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white z-10 relative"
                >
                    <div className="relative">
                        {IconComponent && <IconComponent style={{
                            fontSize: `${pinSize * 0.5}px`, // Icon size is 50% of pin size
                        }} />}
                    </div>

                </div>

                <div
                    className="absolute left-1/2 -translate-x-1/2 top-[calc(100%)] w-0 h-0"
                    style={{
                        borderLeftWidth: `${pinSize * 0.2}px`, // Adjust triangle size dynamically
                        borderRightWidth: `${pinSize * 0.2}px`,
                        borderTopWidth: `${pinSize * 0.25}px`,
                        borderTopColor: pin.color,
                    }}
                    aria-hidden="true"
                ></div>

                <div
                    className="absolute left-1/2 -translate-x-1/2 translate-y-1/3 text-center"
                    style={{
                        fontSize: `${pinSize * 0.55}px`, // Adjust text size dynamically
                        color: pin.color,
                    }}
                    aria-hidden="true"
                >
                    {pin.name}
                </div>

            </div>


        </div>
    );
};

export default PinIcon;