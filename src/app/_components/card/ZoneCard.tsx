"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import Card from "~/app/_components/card/Card";

import BeatLoader from "react-spinners/BeatLoader";
import Link from "next/link";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Modal from "~/app/_components/Modal";
import { toast } from "~/hooks/use-toast";
import { AddZoneForm } from "~/app/_components/form/AddZoneForm";

export const ZoneCard = ({ zoneId }: { zoneId: number }) => {
  const { data: zone } = api.zone.getZoneOverviewById.useQuery({ id: zoneId });
  const deleteZone = api.zone.delete.useMutation({
    onSuccess: async (data) => {
      toast({
        title: "¡Zona Borrada!",
        description: `${data.name} | ${data.createdAt.toISOString()}`,
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);

  return (
    <>
      <Card>
        {zone ? (
          <div className="flex flex-row items-center">
            <div
              className={`h-8 w-8 rounded-full`}
              style={{ backgroundColor: zone.color }}
            ></div>
            <div className="ml-5 mr-auto flex flex-col">
              <p className="font-semibold text-texto">
                <Link href={`/dashboard/zones/${zoneId}`}>{zone.name}</Link>
              </p>
              <p className="text-texto">
                {zone._count.insignias} insignias, {zone._count.exhibitions}{" "}
                exhibiciones, {zone._count.questionAnswers} respuestas de zona.
              </p>
            </div>
            <div className="ml-auto flex flex-row gap-x-6">
              <FaEdit
                className="text-lg text-azul duration-200 hover:text-azul-200"
                onClick={() => setOpenModalEdit(true)}
              />
              <FaTrashAlt
                className="text-red-500 duration-200 hover:text-red-700"
                onClick={() => setOpenModalDelete(true)}
              />
            </div>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center">
            <div>
              <BeatLoader className="w-full" color="#2DEA6D" />
            </div>
          </div>
        )}
      </Card>
      {openModalDelete && (
        <Modal
          title={"Agregar Zona"}
          onClose={() => {
            setOpenModalDelete(false);
          }}
          isOpen={openModalDelete}
        >
          <p>
            ¿Estás seguro de que quieres borrar la zona &quot;{zone?.name}
            &quot;?
          </p>
          <button
            className="mt-2 rounded-lg bg-red-500 p-2 text-white"
            onClick={() => {
              deleteZone.mutate({ id: zoneId });
              setOpenModalDelete(false);
            }}
          >
            Borrar
          </button>
        </Modal>
      )}

      {openModalEdit && (
        <Modal
          title={"Modificar Zona"}
          onClose={() => {
            setOpenModalEdit(false);
          }}
          isOpen={openModalEdit}
        >
          <AddZoneForm
            defaultValues={
              zone
                ? {
                    zoneColor: zone.color,
                    zoneDescription: zone.description,
                    zoneLogo: zone.logo ?? undefined,
                    zoneName: zone.name,
                    id: zone.id,
                  }
                : undefined
            }
            onCompleted={() => setOpenModalEdit(false)}
          />
        </Modal>
      )}
    </>
  );
};
