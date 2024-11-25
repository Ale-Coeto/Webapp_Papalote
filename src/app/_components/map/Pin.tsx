import React from "react";
import {
    useDraggable,
} from "@dnd-kit/core";
import type { Pin } from "@prisma/client";
import { iconDictionary } from "../../../utils/icons";


interface PinProps {
    pin: Pin;
    isDragging: boolean;
    scale: number;
}

const PinIcon: React.FC<PinProps> = ({ pin, isDragging, scale }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: `pin-${pin.id}`,
    });

    const iconData = iconDictionary[pin.icon];
    const IconComponent = iconData?.icon;
    const baseSize = 80;
    const pinSize = baseSize * scale;

    const style: React.CSSProperties = {
        position: "absolute",
        top: pin.y - pinSize / 2,
        left: pin.x - pinSize / 2,
        width: `${pinSize}px`,
        height: `${pinSize}px`,
        cursor: "grab",
        opacity: isDragging ? 0 : 1,
        pointerEvents: isDragging ? "none" : "auto",
        transformOrigin: "center",
    };

    return (

        <div className="z-10  w-auto">

            <div className="absolute" style={{ ...style, }}>
                <div
                    ref={setNodeRef}
                    {...listeners}
                    {...attributes}
                    style={{
                        backgroundColor: pin.color,
                        width: `${pinSize}px`,
                        height: `${pinSize}px`,
                        borderWidth: `${2 * scale}px`,
                    }}
                    className="rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white z-10 relative"
                >
                    <div className="relative">
                        {IconComponent && <IconComponent style={{
                            fontSize: `${pinSize * 0.5}px`,
                        }} />}
                    </div>

                </div>

                <div
                    className="absolute left-1/2 -translate-x-1/2 top-[calc(100%)] w-0 h-0 bg-transparent"
                    style={{
                        borderLeftWidth: `${pinSize * 0.2}px`,
                        borderRightWidth: `${pinSize * 0.2}px`,
                        borderTopWidth: `${pinSize * 0.25}px`,
                        borderLeftColor: "transparent",
                        borderRightColor: "transparent",
                        borderTopColor: pin.color,
                    }}
                    aria-hidden="true"
                ></div>

                <div
                    className="absolute left-1/2 -translate-x-1/2 translate-y-1/3 text-center"
                    style={{
                        fontSize: `${pinSize * 0.55}px`,
                        color: "white",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
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