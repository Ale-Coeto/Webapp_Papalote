import { zoneRouter } from "~/server/api/routers/zone";
import { exhibitionRouter } from "./routers/exhibitions";
import { insigniaRouter } from "~/server/api/routers/insignia";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { specialEventRouter } from "./routers/specialEvent";
import { visitRouter } from "~/server/api/routers/visit";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  zone: zoneRouter,
  insignia: insigniaRouter,
  specialEvent: specialEventRouter,
  exhibition: exhibitionRouter,
  visit: visitRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
