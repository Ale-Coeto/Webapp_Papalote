"use client";

import React, { useState } from "react";
import { Sidebar } from "~/app/_components/Sidebar";
import { TRPCReactProvider } from "~/trpc/react";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

interface RootClientLayoutProps {
  children: React.ReactNode;
  session?: Session; 
}

export const RootClientLayout: React.FC<RootClientLayoutProps> = ({
  children,
  session,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <TRPCReactProvider>
      <div className="flex h-screen">
        <Sidebar
          isCollapsed={isCollapsed}
          toggleCollapse={toggleCollapse}
          session={session}
        />
        <div
          className={`flex flex-col transition-all duration-300 w-full ${isCollapsed ? "ml-20" : "ml-64"}`}
        >
          <div className="flex-grow bg-gradient-to-b from-[#FFFFFF] to-[#FFFFFF] text-black">
            <SessionProvider session={session}>{children}</SessionProvider>
          </div>
        </div>
      </div>
    </TRPCReactProvider>
  );
};
