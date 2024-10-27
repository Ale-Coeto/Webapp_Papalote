"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import Card from "../_components/Card";

import BeatLoader from "react-spinners/BeatLoader";
import Link from "next/link";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import Modal from "./Modal";
import { toast } from "~/hooks/use-toast";

export const ZoneCard = ({ zoneId }: { zoneId: string }) => {
  const { data: zone } = api.zone.getOverviewById.useQuery({ id: zoneId });
  const deleteZone = api.zone.delete.useMutation({
    onSuccess: async (data) => {
      toast({
        title: "Zona Borrada!",
        description: `${data.name} | ${data.createdAt}`,
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const [openModalDelete, setOpenModalDelete] = useState(false);

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
              <p className="font-bold text-gris">
                <Link href={`/zone/${zoneId}`}>{zone.name}</Link>
              </p>
              <p>
                {zone._count.insignias} insignias, {zone._count.exhibitions}{" "}
                exhibiciones, {zone._count.questionAnswers} respuestas de zona.
              </p>
            </div>
            <div className="ml-auto flex flex-row gap-x-6 text-gris">
              <FaRegEdit size={25} />
              <FaRegTrashAlt
                onClick={() => setOpenModalDelete(true)}
                size={25}
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
          <p>Estás seguro de que quieres borrar la zona {zone?.name}?</p>
          <button
            onClick={() => {
              deleteZone.mutate({ id: zoneId });
              setOpenModalDelete(false);
            }}
          >
            Borrar
          </button>
        </Modal>
      )}
    </>
  );
};
