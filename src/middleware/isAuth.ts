import { HttpQueryError } from "apollo-server-core";
import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../utils/MyContext";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  if (!context?.req?.session?.userId) {
    throw new Error("Not authorized");
  }
  return next();
};
