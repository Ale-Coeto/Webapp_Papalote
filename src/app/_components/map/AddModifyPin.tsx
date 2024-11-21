"use client";

import { useState } from "react";
import AddButton from "~/app/_components/Button";
import Modal from "../Modal";
import NewPinModal from "./NewPinModal";

const AddModifyPin = () => {
    const [openNew, setOpenNew] = useState(false);

    return (
        <div>
            <AddButton
                label="Agregar pin"
                onClick={() => {
                    setOpenNew(true);
                }}
            />

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
    )
}

export default AddModifyPin;