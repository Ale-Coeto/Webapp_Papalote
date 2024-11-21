// "use client";
import Title from "~/app/_components/Title"

import Pin from "~/app/_components/map/Pin";
import AddButton from "~/app/_components/Button";
import SwitchButton from "~/app/_components/map/SwitchButton";
import MapContainer from "~/app/_components/map/MapContainer";
import NewPinModal from "~/app/_components/map/NewPinModal";
import Modal from "~/app/_components/Modal";

//   import { arrayMove } from "@dnd-kit/sortable";
import { api } from "~/trpc/server";
import AddModifyPin from "~/app/_components/map/AddModifyPin";

interface Pin {
    id: number;
    x: number;
    y: number;
}

const MapPage = async () => {
    const pins = await api.pin.getPins();

    return (
        <div className="h-full bg-fondo p-10" >
            <div className="mb-10 flex flex-row items-center justify-between">
                <Title text="Eventos Especiales" />


                <AddModifyPin />
            </div>
            <MapContainer pinList={pins} />
            
        </div>
    );
}

export default MapPage;
