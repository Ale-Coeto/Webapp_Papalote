import Title from "~/app/_components/Title"
import MapContainer from "~/app/_components/map/MapContainer";
import { api } from "~/trpc/server";
import AddModifyPin from "~/app/_components/map/AddModifyPin";

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
