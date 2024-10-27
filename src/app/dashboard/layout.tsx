"use client";

import "~/styles/globals.css";

import { Sidebar } from "../_components/Sidebar";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const session = useSession();

  if (!session.data) {
    redirect("/");
  }

  return (
    <div className="flex h-screen">
      <Sidebar
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
      />
      <div
        className={`flex w-full flex-col transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-64"}`}
      >
        <div className="flex-grow bg-gradient-to-b from-[#FFFFFF] to-[#FFFFFF] text-black">
          {children}
        </div>
      </div>
    </div>
  );
}
