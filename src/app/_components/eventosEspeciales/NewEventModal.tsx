import Button from "../Button";
import AddButton from "../forms/AddButton";

export default function NewEventModal() {
    function handleSubmit() {

    }

    return (
        <div className="w-full flex flex-col pb-4 px-4">
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col pb-4 w-full">
                    <label>Nombre del evento</label>
                    <input id="nombre" type="text" className="border-2 rounded-md px-1 w-full" />
                </div>

                <div className="flex flex-col pb-6">
                    <label>Fecha Inicio</label>
                    <input id="fechaInicio" type="date" className="border-2 rounded-md px-1" />
                </div>

                <div className="flex flex-col pb-6">
                    <label>Fecha Fin</label>
                    <input id="fechaFin" type="date" className="border-2 rounded-md px-1" />
                </div>

                <div className="flex flex-col pb-6">
                    <label>Descripción</label>
                    <textarea id="descripcion" className="border-2 rounded-md px-1" />
                </div>

                <div className="flex flex-col pb-6">
                    <label>Infografía</label>
                    <input id="infografia" type="file" className="" accept=".jpg, .jpeg, .png" />
                </div>

                <div className="flex flex-col pb-6">
                    <label>Insignias</label>
                    <div className="flex flex-row pt-1">

                        <AddButton onClick={() => { }} />
                    </div>
                </div>
                <Button label="Agregar" full onClick={() => { }} />
            </form>
        </div>
    )
}