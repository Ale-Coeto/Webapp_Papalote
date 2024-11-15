"use client";
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { UUID } from 'crypto';
import { IoMdPin } from "react-icons/io";


const Pin = ({ id }: { id: string | number }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: id,
    });

    const style = {
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        padding: '20px',
        margin: '10px',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ddd',
        borderRadius: '4px',
        cursor: 'grab',
      };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <IoMdPin />
        </div>
    )

}
export default Pin;