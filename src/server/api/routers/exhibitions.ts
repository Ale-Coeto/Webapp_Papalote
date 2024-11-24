import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  protectedModificationProcedure,
} from "~/server/api/trpc";
import { existingExhibitionSchema } from "~/lib/schemas";
import { getImageLink } from "~/server/supabase";
import { v4 as uuidv4 } from "uuid";

export const exhibitionRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.exhibition.findMany({
      select: {
        id: true,
        zone_id: true,
        name: true,
        description: true,
        image: true,
        is_open: true,
      },
    });
  }),
  getIds: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.exhibition.findMany({
      select: { id: true },
      orderBy: { name: "asc" },
    });
  }),

  getIdsByZone: protectedProcedure
    .input(z.object({ zoneId: z.number().min(1) }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.exhibition.findMany({
        where: { zone_id: input.zoneId },
        select: { id: true, image: true },
        orderBy: { name: "asc" },
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number().min(1) }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.exhibition.findUnique({ where: { id: input.id } });
    }),

  createOrModify: protectedModificationProcedure
    .input(existingExhibitionSchema)
    .mutation(async ({ input, ctx }) => {
      const newUuid = uuidv4();
      const imageLink = await getImageLink(
        input.exhibitionImage,
        "exhibition",
        input.exhibitionId ? String(input.exhibitionId) : newUuid,
      );

      console.log("imageLink", imageLink);

      if (input.exhibitionId) {
        return ctx.db.exhibition.update({
          where: { id: input.exhibitionId },
          data: {
            description: input.exhibitionDescription,
            image: imageLink,
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

  delete: protectedModificationProcedure
    .input(z.object({ id: z.number().min(1) }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.exhibition.delete({ where: { id: input.id } });
    }),
});
