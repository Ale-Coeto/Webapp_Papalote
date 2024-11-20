"use client";
import React, { useCallback, useMemo, useState } from "react";
import Title from "~/app/_components/Title"

import Pin from "~/app/_components/map/Pin";
import AddButton from "~/app/_components/Button";
import SwitchButton from "~/app/_components/map/SwitchButton";
import MapContainer from "~/app/_components/map/MapContainer";
import NewPinModal from "~/app/_components/map/NewPinModal";
import Modal from "~/app/_components/Modal";
//   import { arrayMove } from "@dnd-kit/sortable";


interface Pin {
    id: number;
    x: number;
    y: number;
}

const MapPage = () => {
    const [openNew, setOpenNew] = useState(false);

    const [pins, setPins] = useState<Pin[]>([
        { id: 1, x: 0, y: 0 },
        { id: 2, x: 100, y: 100 },
        { id: 3, x: 200, y: 200 },
    ]);

    return (
        <div className="h-full bg-fondo p-10" >
            <div className="mb-10 flex flex-row items-center justify-between">
                <Title text="Eventos Especiales" />

                <AddButton
                    label="Agregar pin"
                    onClick={() => {
                        setOpenNew(true);
                    }}
                />

            </div>
            <MapContainer pinList={pins} />
            <Modal
                title={"Nuevo Evento"}
                onClose={() => {
                    setOpenNew(false);
                }}
                isOpen={openNew}
                customButtonAction={() => setOpenNew(false)}
            >
                <NewPinModal onClose={() => setOpenNew(false)} />
            </Modal>
        </div>
    );
}

export default MapPage;
