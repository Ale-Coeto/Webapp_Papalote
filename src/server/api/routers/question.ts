import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { existingQuestionSchema } from "~/lib/schemas";

export const questionRouter = createTRPCRouter({
  getIds: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.question.findMany({
      select: { id: true },
      orderBy: { question: "asc" },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.question.findUnique({ where: { id: input.id } });
    }),

  createOrModify: protectedProcedure
    .input(existingQuestionSchema)
    .mutation(async ({ input, ctx }) => {
      if (input.questionId) {
        return ctx.db.question.update({
          where: { id: input.questionId },
          data: {
            question: input.question,
          },
        });
      }

      return await ctx.db.question.create({
        data: {
          question: input.question,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.question.delete({ where: { id: input.id } });
    }),
});
