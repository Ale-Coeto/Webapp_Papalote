import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { appRouter } from "~/server/api/root";
import { createCallerFactory } from "~/server/api/trpc";

import { db } from "~/server/db";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createCaller = createCallerFactory(appRouter);

const caller = createCaller({
  db: db,
  session: {
    expires: "",
    user: {
      id: "1",
      email: "website",
      image: "",
      name: "website",
    },
  },
  headers: new Headers(),
});

// Example request: http://localhost:3000/api/data?type=zones
const getData = async (req: NextRequest) => {
  const type = req.nextUrl.searchParams.get("type");

  const dataType = z
    .enum(["zones", "pins", "insignias", "events", "exhibitions", "lastUpdate", "exhibitionVisits", "museumEntrances"])
    .safeParse(type).data;

  if (!dataType) {
    return NextResponse.json(
      { error: { message: "No valid data type provided" } },
      { status: 400 },
    );
  }

  try {
    if (dataType === "zones") {
      const zones = await caller.zone.get();
      return NextResponse.json({ zones });
    } else if (dataType === "events") {
      const events = await caller.specialEvent.get();
      return NextResponse.json({ events });
    } else if (dataType === "exhibitions") {
      const exhibitions = await caller.exhibition.get();
      return NextResponse.json({ exhibitions });
    } else if (dataType === "pins") {
      return NextResponse.json({
        error: { message: "Not implemented." },
        status: 500,
      });
    } else if (dataType === "insignias") {
      const insignias = await caller.insignia.get();
      return NextResponse.json({ insignias });
    } else if (dataType === "lastUpdate") {
      const lastUpdate = await caller.lastUpdate.getLastUpdate();
      return NextResponse.json({
        date: lastUpdate?.date,
      });
    }
    else if (dataType === "exhibitionVisits") {
      const exhibitionVisits = await caller.visit.getExhibitionVisits();
      return NextResponse.json({ exhibitionVisits });
    }
    else if (dataType === "museumEntrances") {
      const museumEntrances = await caller.museumEntrance.getAll();
      return NextResponse.json({ museumEntrances });
    }
  } catch (cause) {
    if (cause instanceof TRPCError) {
      const httpStatusCode = getHTTPStatusCodeFromError(cause);
      return NextResponse.json(
        { error: { message: cause.message } },
        { status: httpStatusCode },
      );
    }
    return NextResponse.json({
      error: { message: "Error while fetching API." },
      status: 500,
    });
  }
};

export { getData as GET };
