import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  protectedModificationProcedure,
} from "~/server/api/trpc";
import { existingInsigniaSchema } from "~/lib/schemas";
import { getImageLink } from "~/server/supabase";
import { v4 as uuidv4 } from "uuid";
export const insigniaRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.insignia.findMany({
      select: {
        id: true,
        zone_id: true,
        special_event_id: true,
        name: true,
        logo: true,
        description: true,
        nfc_code: true,
      },
    });
  }),

  getIds: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.insignia.findMany({
      select: { id: true },
      orderBy: { name: "asc" },
    });
  }),

  getIdsByZone: protectedProcedure
    .input(z.object({ zoneId: z.number().min(1) }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.insignia.findMany({
        where: { zone_id: input.zoneId },
        select: { id: true, logo: true },
        orderBy: { name: "asc" },
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number().min(1) }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.insignia.findUnique({ where: { id: input.id } });
    }),

  createOrModify: protectedModificationProcedure
    .input(existingInsigniaSchema)
    .mutation(async ({ input, ctx }) => {
      const newUuid = uuidv4();
      const imageLink = await getImageLink(
        input.insigniaLogo,
        "insignia",
        input.insigniaId ? String(input.insigniaId) : newUuid,
      );

      if (input.insigniaId) {
        return ctx.db.insignia.update({
          where: { id: input.insigniaId },
          data: {
            description: input.insigniaDescription,
            logo: imageLink,
            name: input.insigniaName,
            special_event_id: input.insigniaSpecialEventId,
            zone_id: input.zone_id,
            nfc_code: input.insigniaNfcCode,
          },
        });
      }

      return await ctx.db.insignia.create({
        data: {
          description: input.insigniaDescription,
          logo: imageLink,
          name: input.insigniaName,
          special_event_id: input.insigniaSpecialEventId,
          zone_id: input.zone_id,
          nfc_code: input.insigniaNfcCode,
        },
      });
    }),

  delete: protectedModificationProcedure
    .input(z.object({ id: z.number().min(1) }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.insignia.delete({ where: { id: input.id } });
    }),
});
