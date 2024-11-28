"use client";

import { useState } from "react";
import AddButton from "~/app/_components/Button";
import Modal from "../Modal";
import NewPinModal from "./NewPinModal";
import { Zone } from "@prisma/client";

const AddModifyPin = ({ zones }: { zones?: Zone[] }) => {
    const [openNew, setOpenNew] = useState(false);

    return (
        <div className="z-50">
            <div className="flex flex-row gap-4">

                <AddButton
                    label="Agregar pin"
                    onClick={() => {
                        setOpenNew(true);
                    }}
                    isAdd
                />

            </div>

            <Modal
                title={"Nuevo Pin"}
                onClose={() => {
                    setOpenNew(false);
                }}
                isOpen={openNew}
                customButtonAction={() => setOpenNew(false)}
            >
                <NewPinModal onClose={() => setOpenNew(false)} zones={zones} />
            </Modal>


        </div>
    )
}

export default AddModifyPin;