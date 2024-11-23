import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  protectedModificationProcedure,
} from "~/server/api/trpc";
import { v4 as uuidv4 } from "uuid";
import { getImageLink } from "~/server/supabase";

export const specialEventRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.specialEvent.findMany({
      select: {
        id: true,
        start_date: true,
        end_date: true,
        name: true,
        description: true,
        image: true,
      },
    });
  }),
  getSpecialEvents: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.specialEvent.findMany({
      orderBy: {
        start_date: "asc",
      },
    });
  }),

  createSpecialEvent: protectedModificationProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        image: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newUuid = uuidv4();
      const imageLink = await getImageLink(
        input.image,
        "special_event",
        newUuid,
      );
      return ctx.db.specialEvent.create({
        data: {
          name: input.name,
          description: input.description,
          start_date: input.startDate,
          end_date: input.endDate,
          image: imageLink,
        },
      });
    }),

  updateSpecialEvent: protectedModificationProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        description: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        image: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newUuid = uuidv4();
      const imageLink = await getImageLink(
        input.image,
        "special_event",
        input.id ? String(input.id) : newUuid,
      );
      return ctx.db.specialEvent.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
          start_date: input.startDate,
          end_date: input.endDate,
          image: imageLink,
        },
      });
    }),

  deleteSpecialEvent: protectedModificationProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.specialEvent.delete({
        where: {
          id: input,
        },
      });
    }),
});
