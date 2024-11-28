"use client";

import AddButton from "~/app/_components/Button";
import Title from "~/app/_components/Title";
import Card from "~/app/_components/card/Card";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Modal from "~/app/_components/Modal";
import { useState } from "react";
import NewEventModal from "~/app/_components/eventosEspeciales/NewEventModal";
import EditEventModal from "~/app/_components/eventosEspeciales/EditEventModal";
import { api } from "~/trpc/react";
import type { SpecialEvent } from "@prisma/client";
import { InsigniasCard } from "~/app/_components/card/InsigniasCard";
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import BeatLoader from "react-spinners/BeatLoader";
import { useToast } from "~/hooks/use-toast";

export default function EventosEspeciales() {
  const [openNew, setOpenNew] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SpecialEvent>();

  const { data: events, isLoading: isLoading } = api.specialEvent.getSpecialEvents.useQuery();


  const handleEdit = (event: SpecialEvent) => {
    setSelectedEvent(event);
    setOpenEdit(true);
  };

  // State to track which events are showing InsigniasCard
  //const [insigniasVisibility, setInsigniasVisibility] = useState<{ [key: number]: boolean }>({});
  // State to track which events are showing InsigniasCard
  const [insigniasVisibility, setInsigniasVisibility] = useState<Record<number, boolean>>({});


  const toggleInsigniasVisibility = (eventId: number) => {
    setInsigniasVisibility((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],  // Toggle the visibility for this event
    }));
  };

  const { toast } = useToast();
  const utils = api.useUtils();
  
  const deleteEvent = api.specialEvent.deleteSpecialEvent.useMutation({
    onSuccess: async (data) => {
      toast({
        title: `¡Evento eliminado!`,
        description: `${data.name}`,
      });
      await utils.specialEvent.invalidate();
    },
    onError: (error) => {
      toast({
        title: `Error al eliminar el evento`,
        description: error.message || JSON.stringify(error),
      });
    },
  });
  
  const handleDelete = (event: SpecialEvent) => {
    if (window.confirm("¿Estás seguro que deseas eliminar este evento?")) {
      deleteEvent.mutate(event.id);
    }
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
          isAdd
        />
      </div>

      {isLoading ? (
        <div className="flex w-full flex-col items-center py-10">
          <BeatLoader color={"#2DEA6D"} loading={true} size={15} />
        </div>
      ) : (
        events &&
        <div className="flex flex-col gap-4 py-5 lg:px-40">
          {events.map((event, key) => (
            <div key={key}>
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
                    <button onClick={() => handleDelete(event)}>
                      <FaTrashAlt className="text-lg text-red-500 hover:text-red-400" />
                    </button>
                  </div>
                </div>
                {/* Button to trigger the InsigniasCard visibility toggle */}
                <div className="flex justify-center">
                  <button
                    onClick={() => toggleInsigniasVisibility(event.id)}
                    className=" text-white p-2 rounded flex items-center justify-center"
                  >
                    {insigniasVisibility[event.id] ? (
                      <FaChevronUp className="mr-2 text-blue-500" />
                    ) : (
                      <FaChevronDown className="mr-2 text-blue-500" />
                    )}
                    {/*insigniasVisibility[event.id] ? "Ocultar Insignias" : "Ver Insignias"*/}
                  </button>
                </div>
                {insigniasVisibility[event.id] && <InsigniasCard className="mt-2 shadow-lg border border-gray-200 rounded-lg" eventId={event.id} />}
              </Card>
            </div>
          ))}

        </div>
      )}

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
