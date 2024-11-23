"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import Card from "./Card";

import BeatLoader from "react-spinners/BeatLoader";
import { FaEdit } from "react-icons/fa";
import Modal from "../Modal";
import { AddZoneForm } from "../form/AddZoneForm";

export const DescriptionCard = ({ zoneId }: { zoneId: number }) => {
  const { data: zone } = api.zone.getZoneOverviewById.useQuery({ id: zoneId });

  const [openModalEdit, setOpenModalEdit] = useState(false);

  return (
    <>
      <Card>
        {zone ? (
          <div className="flex flex-col">
            <div className="flex flex-row items-center">
              <div
                className={`h-20 w-20 rounded-full`}
                style={{
                  backgroundImage: zone ? `url(${zone.logo})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
              <div className="ml-5 mr-auto flex flex-col">
                <p className="font-bold text-gris">Descripción</p>
                <p>{zone.description}</p>
                <div className="mt-7 flex flex-row gap-x-14">
                  <div className="flex w-fit flex-row items-center gap-x-1">
                    <p className="font-bold text-gris">Color:</p>
                    <p>{zone.color}</p>
                  </div>
                  <div className="flex w-fit flex-row items-center gap-x-1">
                    <p className="font-bold text-gris">Fecha de creación:</p>
                    <p>{zone.createdAt.toDateString()}</p>
                  </div>
                  <div className="flex w-fit flex-row items-center gap-x-1">
                    <p className="font-bold text-gris">Última modificación:</p>
                    <p>{zone.updatedAt.toDateString()}</p>
                  </div>
                </div>
              </div>
              <div className="ml-auto flex flex-row gap-x-6">
                <FaEdit
                  className="text-lg text-azul duration-200 hover:text-azul-200"
                  onClick={() => setOpenModalEdit(true)}
                  size={26}
                />
              </div>
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
