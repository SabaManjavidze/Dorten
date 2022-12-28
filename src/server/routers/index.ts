import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "../../utils/context";

const t = initTRPC.context<Context>().create();
export const router = t.router;
export const procedure = t.procedure;
export const middleware = t.middleware;
