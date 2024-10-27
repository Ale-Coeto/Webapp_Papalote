import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { existingZoneSchema, zoneSchema } from "~/lib/schemas";

export const zoneRouter = createTRPCRouter({
  getIds: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.zone.findMany({ select: { id: true } });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.zone.findUnique({ where: { id: input.id } });
    }),

  getOverviewById: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.zone.findUnique({
        where: { id: input.id },
        select: {
          color: true,
          name: true,
          _count: {
            select: {
              insignias: true,
              exhibitions: true,
              questionAnswers: true,
            },
          },
        },
      });
    }),

  modify: protectedProcedure
    .input(existingZoneSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.zone.update({
        where: { id: input.id },
        data: {
          name: input.zoneName,
          description: input.zoneDescription,
          color: input.zoneColor,
          logo: input.zoneLogo,
        },
      });
    }),

  create: protectedProcedure
    .input(zoneSchema)
    .mutation(async ({ input, ctx }) => {
      const zone = await ctx.db.zone.create({
        data: {
          name: input.zoneName,
          description: input.zoneDescription,
          color: input.zoneColor,
          logo: input.zoneLogo,
        },
      });

      return zone;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.zone.delete({ where: { id: input.id } });
    }),
});
