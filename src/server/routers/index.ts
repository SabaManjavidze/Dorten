import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "../../utils/context";

const t = initTRPC.context<Context>().create();
export const router = t.router;
export const procedure = t.procedure;

export const isAuthed = t.middleware(({ ctx: { req }, next }) => {
  if (!req.session || !req.session.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: { req },
  });
});
