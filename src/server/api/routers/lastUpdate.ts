import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const lastUpdateRouter = createTRPCRouter({
  getLastUpdate: protectedProcedure.query(async ({ ctx }) => {
    const lastUpdate = await ctx.db.lastFetch.findFirst();
    if (!lastUpdate) {
      return await ctx.db.lastFetch.create({
        data: {
          date: new Date(),
        },
      });
    }
    return lastUpdate;
  }),
});
