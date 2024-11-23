import React from "react";
import {
    useDraggable,
} from "@dnd-kit/core";
import { Pin } from "@prisma/client";
import { iconDictionary } from "../../../utils/icons";


interface PinProps {
    pin: Pin;
    isDragging: boolean;
    imageRect: { width: number; height: number };
    // onDragEnd: (id: number, x: number, y: number) => void;
}

const PinIcon: React.FC<PinProps> = ({ pin, isDragging }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: `pin-${pin.id}`,
    });

    const iconData = iconDictionary[pin.icon];
    const IconComponent = iconData?.icon;

    const style: React.CSSProperties = {
        position: "absolute",
        top: pin.y,
        left: pin.x,
        cursor: "grab",
        opacity: isDragging ? 0 : 1,
        pointerEvents: isDragging ? "none" : "auto",
    };

    return (
        <div>

            <div className="absolute" style={{ ...style, width: "fit-content" }}>
                <div
                    ref={setNodeRef}
                    {...listeners}
                    {...attributes}
                    style={{ backgroundColor: pin.color }}
                    className="rounded-full w-8 h-8 flex items-center justify-center text-white shadow-lg border-2 border-white z-40 relative"
                >
                    {IconComponent && <IconComponent />}
                </div>

                <div
                    className="absolute left-1/2 -translate-x-1/2 top-[calc(100%)] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px]"
                    style={{ borderTopColor: pin.color }}
                    aria-hidden="true"
                ></div>

                <div
                    className="absolute left-1/2 -translate-x-1/2 translate-y-1/3"
                    style={{ borderTopColor: pin.color }}
                    aria-hidden="true"
                >
                    {pin.name}
                </div>

            </div>


        </div>
    );
};

export default PinIcon;