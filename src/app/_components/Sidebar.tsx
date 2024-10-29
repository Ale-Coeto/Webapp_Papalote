"use client";

import {
  faCalendar,
  faChevronLeft,
  faChevronRight,
  faSignOutAlt,
  type IconDefinition,
  faChartSimple,
  faQuestion,
  faLocation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";

import { twMerge } from "tailwind-merge";
import { api } from "~/trpc/react";

interface SidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  session?: Session | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  toggleCollapse,
}) => {
  const { data: zoneNames, isLoading } = api.zone.getNames.useQuery();

  return (
    <div
      className={`flex flex-col ${isCollapsed ? "w-20" : "w-64"} transition-width fixed left-0 top-0 z-40 h-screen justify-center bg-white text-gris shadow-lg duration-300`}
    >
      <div
        className="flex h-20 items-center justify-between px-4"
        onClick={toggleCollapse}
      >
        <span className="flex items-center space-x-2 text-2xl text-texto hover:cursor-pointer">
          <p>🪁</p>
          {!isCollapsed && <span>Papalote</span>}
        </span>
        <button className="text-white focus:outline-none">
          <FontAwesomeIcon
            icon={isCollapsed ? faChevronRight : faChevronLeft}
            // color="azul"
            className="text-azul h-4 w-4"
          />
        </button>
      </div>

      <nav className="mt-4 flex flex-grow flex-col justify-center">
        <SideBarElement
          isCollapsed={isCollapsed}
          icon={faChartSimple}
          label="Estadísticas"
          link="/dashboard/stats"
        />

        <SideBarElement
          isCollapsed={isCollapsed}
          icon={faCalendar}
          label="Eventos Especiales"
          link="/dashboard/eventosEspeciales"
        />

        <SideBarElement
          isCollapsed={isCollapsed}
          icon={faQuestion}
          label="Cuestionario"
          link="/dashboard/questionnaire"
        />

        <SideBarElement
          isCollapsed={isCollapsed}
          icon={faLocation}
          label="Zonas"
          link="/dashboard/zones"
        />
        {zoneNames?.map((zone) => (
          <SideBarElement
            key={zone.id}
            isCollapsed={isCollapsed}
            icon={faLocation}
            label={zone.name}
            link={`/dashboard/zones/${zone.id}`}
            className={`ml-9 ${isCollapsed ? "hidden" : ""}`}
          />
        ))}

        <div className="mt-auto border-t-[1px] border-gray-300">
          <SideBarElement
            isCollapsed={isCollapsed}
            icon={faSignOutAlt}
            label="Salir"
            link="/"
            exit={true}
          />
        </div>
      </nav>
    </div>
  );
};

const SideBarElement = ({
  isCollapsed,
  icon,
  label,
  link,
  className,
  exit,
}: {
  isCollapsed: boolean;
  icon: IconDefinition;
  label: string;
  link: string;
  className?: string;
  exit?: boolean;
}) => {
  return (
    <Link
      href={link}
      className={twMerge(
        "flex items-center justify-center px-6 py-3 transition duration-200 hover:underline ",
        className,
      )}
      onClick={() => {
        if (exit) signOut({ callbackUrl: "/" });
      }}
    >
      <FontAwesomeIcon icon={icon} className={`mr-3 h-5 w-5 self-center ${label == "Salir" ? "text-azul" : "text-verde"}`} />
      {!isCollapsed && (
        <span className="flex-grow text-md text-texto">
          {label}
        </span>
      )}
    </Link>
  );
};
