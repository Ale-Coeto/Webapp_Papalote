import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  existingQuestionSchema,
  existingQuestionAnswerSchema,
} from "~/lib/schemas";
import { TRPCError } from "@trpc/server";

export const questionRouter = createTRPCRouter({
  getIds: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.question.findMany({
      select: { id: true },
      orderBy: { id: "asc" },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
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
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.question.delete({ where: { id: input.id } });
    }),

  createOrModifyAnswer: protectedProcedure
    .input(existingQuestionAnswerSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        if (input.id) {
          return ctx.db.questionAnswer.update({
            where: { id: input.id },
            data: {
              answer: input.answer,
            },
          });
        }

        return await ctx.db.questionAnswer.create({
          data: {
            answer: input.answer,
            zone_id: input.zone_id,
            question_id: input.question_id,
          },
        });
      } catch (error) {
        if (error instanceof Error) {
          if (
            error.message.includes(
              "Unique constraint failed on the constraint: `QuestionAnswer_question_id_zone_id_key`",
            )
          ) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Ya existe una respuesta con la misma zona y pregunta.",
            });
          }
        }
        throw error;
      }
    }),

  getAnswerIds: protectedProcedure
    .input(z.object({ questionId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.questionAnswer.findMany({
        where: { question_id: input.questionId },
        select: { id: true },
        orderBy: { answer: "asc" },
      });
    }),

  getAnswerById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.questionAnswer.findUnique({
        where: { id: input.id },
      });
    }),

  deleteAnswer: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.questionAnswer.delete({ where: { id: input.id } });
    }),
});
