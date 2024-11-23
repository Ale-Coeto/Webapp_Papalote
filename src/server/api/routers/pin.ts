import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const pinRouter = createTRPCRouter({
    getPins: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.pin.findMany({
        });
    }),

    createPin: protectedProcedure
    .input(z.object({
        name: z.string(),
        color: z.string(),
        icon: z.string(),
        piso: z.number(),
        zone_id: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
        return ctx.db.pin.create({
            data: {
                name: input.name,
                color: input.color,
                icon: input.icon,
                piso: input.piso,
                x: 0,
                y: 0,
                ...(input.zone_id && {
                    zone: {
                        connect: {
                            id: input.zone_id,
                        },
                    },
                }),
            },
        });
    }),

    updatePins: protectedProcedure
    .input(
        z.array(z.object({
            id: z.number(),
            name: z.string(),
            color: z.string(),
            icon: z.string(),
            piso: z.number(),
            x: z.number(),
            y: z.number(),
        })),
    )
    .mutation(async ({ ctx, input }) => {
        return input.map(async (pin) => {
            return await ctx.db.pin.update({
                where: {
                    id: pin.id,
                },
                data: {
                    name: pin.name,
                    color: pin.color,
                    icon: pin.icon,
                    piso: pin.piso,
                    x: pin.x,
                    y: pin.y,
                },
            });
        });
    }),

    updatePin: protectedProcedure
    .input(z.object({
        id: z.number(),
        name: z.string(),
        color: z.string(),
        icon: z.string(),
        piso: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
        return await ctx.db.pin.update({
            where: {
                id: input.id,
            },
            data: {
                name: input.name,
                color: input.color,
                icon: input.icon,
                piso: input.piso,
            },
        });
    }),

    deletePin: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
        return await ctx.db.pin.delete({
            where: {
                id: input,
            },
        });
    }),

})