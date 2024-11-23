import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  protectedModificationProcedure,
} from "~/server/api/trpc";
import { existingZoneSchema } from "~/lib/schemas";
import { getImageLink } from "~/server/supabase";
import { v4 as uuidv4 } from "uuid";

export const zoneRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.zone.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        color: true,
        logo: true,
      },
    });
  }),
  getNameById: protectedProcedure
    .input(z.object({ id: z.number().min(1) }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.zone.findUnique({
        where: { id: input.id },
        select: {
          name: true,
        },
      });
    }),

  getIds: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.zone.findMany({
      select: { id: true },
      orderBy: { name: "asc" },
    });
  }),

  getOptions: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.zone.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number().min(1) }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.zone.findUnique({ where: { id: input.id } });
    }),

  getZoneOverviewById: protectedProcedure
    .input(z.object({ id: z.number().min(1) }))
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
    .input(z.object({ id: z.number().min(1) }))
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
  createOrModify: protectedModificationProcedure
    .input(existingZoneSchema)
    .mutation(async ({ input, ctx }) => {
      const newUuid = uuidv4();
      const imageLink = await getImageLink(
        input.zoneLogo,
        "zonas",
        input.id ? String(input.id) : newUuid,
      );

      if (input.id) {
        return ctx.db.zone.update({
          where: { id: input.id },
          data: {
            name: input.zoneName,
            description: input.zoneDescription,
            color: input.zoneColor,
            logo: imageLink,
          },
        });
      }

      return await ctx.db.zone.create({
        data: {
          name: input.zoneName,
          description: input.zoneDescription,
          color: input.zoneColor,
          logo: imageLink,
        },
      });
    }),

  delete: protectedModificationProcedure
    .input(z.object({ id: z.number().min(1) }))
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
