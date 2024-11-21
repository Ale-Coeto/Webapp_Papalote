import React, { useState } from "react";
import {
    DndContext,
    type DragEndEvent,
    useDraggable,
} from "@dnd-kit/core";

interface PinProps {
    id: number;
    x: number;
    y: number;
    color: string;
    isDragging: boolean;
    // imageRect: { width: number; height: number };
    // onDragEnd: (id: number, x: number, y: number) => void;
}

const PinIcon: React.FC<PinProps> = ({ id, x, y, color, isDragging }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: `pin-${id}`,
    });

    // const xR = (x / 100) * imageRect.width;
    // const yR = (y / 100) * imageRect.height;

    const style: React.CSSProperties = {
        position: "absolute",
        top: y,
        left: x,
        cursor: "grab",
        opacity: isDragging ? 0 : 1, // Hide the pin visually if it's being dragged
        pointerEvents: isDragging ? "none" : "auto", // Disable interaction while dragging
    };

    return (
        <div style={{ ...style, position: "relative", width: "fit-content" }}>
            <div
                ref={setNodeRef}
                {...listeners}
                {...attributes}
                style={{ backgroundColor: color }}
                className="rounded-full w-8 h-8 flex items-center justify-center text-white shadow-lg border-2 border-white z-40 relative"
            >
                {id}
            </div>
            <div
                className="absolute top-[calc(100%)] left-1/2 -translate-x-1/2 mt-[-1px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] z-30"
                style={{ borderTopColor: color }} /* Match the pin's color */
                aria-hidden="true"
            ></div>
        </div>
    );
};

export default PinIcon;