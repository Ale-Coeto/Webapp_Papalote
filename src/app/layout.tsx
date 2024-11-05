import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { getServerAuthSession } from "~/server/auth";
import { NextAuthProvider } from "~/app/_components/auth/NextAuthProvider";
import { RedirectDashboard } from "~/app/_components/auth/Redirect";
import { Toaster } from "~/app/_components/shadcn/ui/toaster";

export const metadata: Metadata = {
  title: "Papalote Museo del Niño",
  description: "SwiftMasters",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerAuthSession();

  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <NextAuthProvider>{children}</NextAuthProvider>
          <RedirectDashboard session={session} />
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
