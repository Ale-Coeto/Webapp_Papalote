'use client';

import AddButton from "~/app/_components/Button";
import Title from "~/app/_components/Title";
import Card from "~/app/_components/Card";
import { FaEdit } from "react-icons/fa";
import Modal from "~/app/_components/Modal";
import { useState } from "react";
import NewEventModal from "~/app/_components/eventosEspeciales/NewEventModal";
import EditEventModal from "~/app/_components/eventosEspeciales/EditEventModal";

export default function EventosEspeciales() {
    const [openNew, setOpenNew] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)

    return (
        <div className="h-screen p-10 bg-fondo">
            <div className="flex flex-row items-center justify-between mb-10">

                <Title text="Eventos Especiales" />

                <AddButton label="Agregar evento" onClick={() => { setOpenNew(true) }} />
            </div>

            <div>
                <Card>
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col">
                            <h1 className="font-semibold text-texto">Evento 1</h1>
                            <p className="text-texto"> Descripción de un evento especial </p>
                        </div>
                        <button onClick={() => { setOpenEdit(true) }}>
                            <FaEdit className="text-lg text-azul hover:text-azul-200" />
                        </button>
                    </div>
                </Card>
            </div>

            <Modal title={"Nuevo Evento"} onClose={() => { setOpenNew(false) }} isOpen={openNew} customButtonAction={() => setOpenNew(false)}>
                <NewEventModal />
            </Modal>

            <Modal title={"Editar Evento"} onClose={() => { setOpenEdit(false) }} isOpen={openEdit} >
                <EditEventModal />
            </Modal>
        </div>
    )
}