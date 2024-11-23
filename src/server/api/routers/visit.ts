import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const visitRouter = createTRPCRouter({
  musemuEntrance: protectedProcedure.mutation(async ({ ctx }) => {
    return ctx.db.museumEntrance.create({ data: {} });
  }),

  exhibitionVisit: protectedProcedure
    .input(z.object({ id: z.string(), rating: z.number().optional() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.exhibitionVisit.create({
        data: {
          exhibition_id: input.id,
          rating: input.rating,
        },
      });
    }),

    getExhibitionVisits: protectedProcedure.query(async ({ ctx }) => {
      return ctx.db.exhibitionVisit.findMany();
    }),

    getVisitsByExhibitionId: protectedProcedure
    .input(z.object({ exhibitionId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.exhibitionVisit.findMany({
        where: { exhibition_id: input.exhibitionId },
      });
    }),

});
