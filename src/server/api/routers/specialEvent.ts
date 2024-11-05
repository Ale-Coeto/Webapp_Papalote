import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

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

  createSpecialEvent: protectedProcedure
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
      return ctx.db.specialEvent.create({
        data: {
          name: input.name,
          description: input.description,
          start_date: input.startDate,
          end_date: input.endDate,
          image: input.image,
        },
      });
    }),

  updateSpecialEvent: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        image: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.specialEvent.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
          start_date: input.startDate,
          end_date: input.endDate,
          image: input.image,
        },
      });
    }),

  deleteSpecialEvent: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.specialEvent.delete({
        where: {
          id: input,
        },
      });
    }),
});
