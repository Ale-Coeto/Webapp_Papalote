import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { existingZoneSchema } from "~/lib/schemas";

export const zoneRouter = createTRPCRouter({
  getIds: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.zone.findMany({ select: { id: true }, orderBy: { name: "asc" } });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.zone.findUnique({ where: { id: input.id } });
    }),

  getZoneOverviewById: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.zone.findUnique({
        where: { id: input.id },
        select: {
          color: true,
          name: true,
          id: true,
          description: true,
          logo: true,
          createdAt: true,
          updatedAt: true,
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
    getZoneById: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.zone.findUnique({
        where: { id: input.id },
        select: {
          color: true,
          name: true,
          description: true,
          logo: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }),
  createOrModify: protectedProcedure
    .input(existingZoneSchema)
    .mutation(async ({ input, ctx }) => {
      if (input.id) {
        return ctx.db.zone.update({
          where: { id: input.id },
          data: {
            name: input.zoneName,
            description: input.zoneDescription,
            color: input.zoneColor,
            logo: input.zoneLogo,
          },
        });
      }

      return await ctx.db.zone.create({
        data: {
          name: input.zoneName,
          description: input.zoneDescription,
          color: input.zoneColor,
          logo: input.zoneLogo,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.zone.delete({ where: { id: input.id } });
    }),

  getNames: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.zone.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }),
});
