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

const visitSchema = z.object({
  isEntrance: z.boolean().optional(),
  exhibitionId: z.string().optional(),
  rating: z.number().optional(),
});

const registerVisit = async (req: NextRequest) => {
  const visitData = visitSchema.safeParse(req.json()).data;

  try {
    if (visitData?.isEntrance) {
      await caller.visit.musemuEntrance();
    } else if (visitData?.exhibitionId) {
      await caller.visit.exhibitionVisit({
        id: visitData.exhibitionId,
        rating: visitData.rating,
      });
    } else {
      return NextResponse.json(
        {
          error: {
            message:
              "Invalid visit data. Must contain either isEntrance or exhibitionId.",
          },
        },
        { status: 400 },
      );
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

  return NextResponse.json({ success: true });
};

export { registerVisit as POST };
