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
    // onDragEnd: (id: number, x: number, y: number) => void;
}

const Pin: React.FC<PinProps> = ({ id, x, y }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: `pin-${id}`,
      });
    
      const style: React.CSSProperties = {
        position: "absolute",
        top: y,
        left: x,
        cursor: "grab",
      };
    
      return (
        <div
          ref={setNodeRef}
          {...listeners}
          {...attributes}
          style={style}
          className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center text-white shadow-lg"
        >
          {id}
        </div>
      );
};

export default Pin;