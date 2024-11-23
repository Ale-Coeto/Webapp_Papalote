import { zoneRouter } from "~/server/api/routers/zone";
import { exhibitionRouter } from "./routers/exhibitions";
import { insigniaRouter } from "~/server/api/routers/insignia";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { specialEventRouter } from "./routers/specialEvent";
import { questionRouter } from "~/server/api/routers/question";
import { visitRouter } from "~/server/api/routers/visit";
import { lastUpdateRouter } from "~/server/api/routers/lastUpdate";
import { museumEntranceRouter } from "./routers/museumEntrance";
import { pinRouter } from "~/server/api/routers/pin";

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
  question: questionRouter,
  visit: visitRouter,
  lastUpdate: lastUpdateRouter,
  museumEntrance: museumEntranceRouter,
  pin: pinRouter,
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
