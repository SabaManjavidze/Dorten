import { HttpQueryError } from "apollo-server-core";
import { GraphQLError } from "graphql";
import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../utils/MyContext";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  if (!context?.req?.session?.userId) {
    throw new GraphQLError("Not authorized");
  }
  return next();
};
