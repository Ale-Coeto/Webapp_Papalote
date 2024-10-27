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

interface SidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  session?: Session | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  toggleCollapse,
}) => {

  return (
    <div
      className={`flex flex-col ${isCollapsed ? "w-20" : "w-64"} transition-width text-gris fixed left-0 top-0 z-40 h-screen justify-center bg-white shadow-lg duration-300`}
    >
      <div
        className="flex h-20 items-center justify-between px-4"
        onClick={toggleCollapse}
      >
        <span className="flex items-center space-x-2 text-2xl font-bold hover:cursor-pointer text-black ">
          <p>🪁</p>
          {!isCollapsed && <span>Papalote</span>}
        </span>
        <button className="text-white focus:outline-none">
          <FontAwesomeIcon
            icon={isCollapsed ? faChevronRight : faChevronLeft}
            color="black"
            className="h-4 w-4"
          />
        </button>
      </div>

      <nav className="mt-4 flex flex-grow flex-col justify-center">
        <SideBarElement
          isCollapsed={isCollapsed}
          icon={faChartSimple}
          label="Estadísticas"
          link="/stats"
        />

        <SideBarElement
          isCollapsed={isCollapsed}
          icon={faCalendar}
          label="Eventos Especiales"
          link="/eventosEspeciales"
        />

        <SideBarElement
          isCollapsed={isCollapsed}
          icon={faQuestion}
          label="Cuestionario"
          link="/questionnaire"
        />

        <SideBarElement
          isCollapsed={isCollapsed}
          icon={faLocation}
          label="Zonas"
          link="/zones"
        />

        <div className="border-gray-300 mt-auto border-t-[1px]">
          <SideBarElement
            isCollapsed={isCollapsed}
            icon={faSignOutAlt}
            label="Salir"
            link="/"
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
}: {
  isCollapsed: boolean;
  icon: IconDefinition;
  label: string;
  link: string;
  className?: string;
}) => {
  return (
    <Link
      href={link}
      className={twMerge(
        "flex items-center justify-center px-6 py-3 transition hover:bg-green-200  duration-200",
        className,
      )}
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      <FontAwesomeIcon icon={icon} className="mr-3 h-5 w-5 self-center" />
      {!isCollapsed && <span className="flex-grow text-lg text-black font-semibold">{label}</span>}
    </Link>
  );
};
