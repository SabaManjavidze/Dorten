import "reflect-metadata";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageProductionDefault,
} from "apollo-server-core";
import { ApolloServer } from "apollo-server-micro";
import { buildSchema } from "type-graphql";
import UserResolver from "../../src/resolvers/UserResolver";
import dotenv from "dotenv";
import PostResolver from "../../src/resolvers/PostResolver";
dotenv.config();

const server = new ApolloServer({
  schema: await buildSchema({
    resolvers: [UserResolver, PostResolver],
    validate: false,
  }),
  plugins: [
    process.env.NODE_ENV === "production"
      ? ApolloServerPluginLandingPageProductionDefault()
      : ApolloServerPluginLandingPageGraphQLPlayground(),
  ],
});
export const config = {
  api: {
    bodyParser: false,
  },
};
const startServer = server.start();
export default async function handler(req: any, res: any) {
  await startServer;
  await server.createHandler({ path: "/api/graphql" })(req, res);
}
