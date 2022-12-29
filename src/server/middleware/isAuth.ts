import { TRPCError } from "@trpc/server";
import { middleware } from "../routers";

export const isAuthed = middleware(({ ctx: { req }, next }) => {
  if (!req.session || !req.session.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: { req },
  });
});
