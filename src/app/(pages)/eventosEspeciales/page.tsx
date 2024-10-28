"use client";

import AddButton from "~/app/_components/Button";
import Title from "~/app/_components/Title";
import Card from "~/app/_components/card/Card";
import { FaEdit } from "react-icons/fa";
import Modal from "~/app/_components/Modal";
import { use, useEffect, useState } from "react";
import NewEventModal from "~/app/_components/eventosEspeciales/NewEventModal";
import EditEventModal from "~/app/_components/eventosEspeciales/EditEventModal";
import { api } from "~/trpc/react";
import { SpecialEvent } from "@prisma/client";

export default function EventosEspeciales() {
  const [openNew, setOpenNew] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SpecialEvent>();

  const events = api.specialEventRouter.getSpecialEvents.useQuery();

  const handleEdit = (event: SpecialEvent) => {
    setSelectedEvent(event);
    setOpenEdit(true);
  };

  return (
    <div className="h-full bg-fondo p-10">
      <div className="mb-10 flex flex-row items-center justify-between">
        <Title text="Eventos Especiales" />

        <AddButton
          label="Agregar evento"
          onClick={() => {
            setOpenNew(true);
          }}
        />
      </div>

      <div className="flex flex-col gap-4 py-5 lg:px-40">
        {events.data?.map((event, key) => (
          <Card key={key}>
            <div className="flex flex-row justify-between">
              <div className="flex flex-col">
                <h1 className="font-semibold text-texto"> {event.name} </h1>
                <p className="text-texto"> {event.description} </p>
              </div>
              <div className="flex flex-row gap-6">
                <div className="items-left flex flex-col justify-center text-sm text-gris">
                  <div>{event.start_date.toISOString().slice(0, 10)}</div>
                  <div>{event.end_date.toISOString().slice(0, 10)}</div>
                </div>

                <button onClick={() => handleEdit(event)}>
                  <FaEdit className="text-lg text-azul hover:text-azul-200" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        title={"Nuevo Evento"}
        onClose={() => {
          setOpenNew(false);
        }}
        isOpen={openNew}
        customButtonAction={() => setOpenNew(false)}
      >
        <NewEventModal onClose={() => setOpenNew(false)} />
      </Modal>

      <Modal
        title={"Editar Evento"}
        onClose={() => {
          setOpenEdit(false);
        }}
        isOpen={openEdit}
      >
        {selectedEvent && (
          <EditEventModal
            onClose={() => setOpenEdit(false)}
            event={selectedEvent}
          />
        )}
      </Modal>
    </div>
  );
}
