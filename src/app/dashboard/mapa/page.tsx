"use client";
import React, { useMemo } from "react";
import Title from "~/app/_components/Title"
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
import Pin from "~/app/_components/map/Pin";
//   import { arrayMove } from "@dnd-kit/sortable";

const MapPage = () => {
    const [gridSize, setGridSize] = React.useState(30);
    const style = {
        alignItems: 'flex-start',
    };

    const buttonStyle = {
        marginLeft: gridSize - 20 + 1,
        marginTop: gridSize - 20 + 1,
        width: gridSize * 8 - 1,
        height: gridSize * 2 - 1,
    };

    // const snapToGrid = useMemo(() => createSnapModifier(gridSize), [gridSize]);
    return (
        // <div className="grid h-full grid-cols-3 gap-4">

        // </div>
        <div className="h-full bg-fondo p-10">
            <div className="mb-10 flex flex-row items-center justify-between">
                <Title text="Mapa" />
                <div>
                    <DndContext onDragEnd={handleDragEnd}>
                        <Pin id={12} />
                    </DndContext>
                </div>
            </div>
        </div>
    );
}

function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over) {
      console.log(`Dropped ${active.id} over ${over.id}`);
    } else {
      console.log(`Dropped ${active.id} with no target`);
    }
  }
export default MapPage;
