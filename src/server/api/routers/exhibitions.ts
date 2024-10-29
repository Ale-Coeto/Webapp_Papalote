import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { existingExhibitionSchema } from "~/lib/schemas";

export const exhibitionRouter = createTRPCRouter({
  getIds: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.exhibition.findMany({
      select: { id: true },
      orderBy: { name: "asc" },
    });
  }),

  getIdsByZone: protectedProcedure
    .input(z.object({ zoneId: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.exhibition.findMany({
        where: { zone_id: input.zoneId },
        select: { id: true, image: true },
        orderBy: { name: "asc" },
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.exhibition.findUnique({ where: { id: input.id } });
    }),

  createOrModify: protectedProcedure
    .input(existingExhibitionSchema)
    .mutation(async ({ input, ctx }) => {
      if (input.exhibitionId) {
        return ctx.db.exhibition.update({
          where: { id: input.exhibitionId },
          data: {
            description: input.exhibitionDescription,
            image: input.exhibitionImage,
            name: input.exhibitionName,
            is_open: input.exhibitionIsOpen,
            zone_id: input.zone_id,
          },
        });
      }

      return await ctx.db.exhibition.create({
        data: {
          description: input.exhibitionDescription,
          image: input.exhibitionImage,
          name: input.exhibitionName,
          is_open: input.exhibitionIsOpen,
          zone_id: input.zone_id,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.exhibition.delete({ where: { id: input.id } });
    }),
});
