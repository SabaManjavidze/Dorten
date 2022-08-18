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
import { createUserLoader } from "../../src/utils/loaders/createUserLoader";
import { createPostLoader } from "../../src/utils/loaders/createPostLoader";
import nextSession from "next-session";
import { expressSession, promisifyStore } from "next-session/lib/compat";
import RedisStoreFactory from "connect-redis";
import Redis from "ioredis";
import { MyContext } from "../../src/utils/MyContext";

dotenv.config();

const RedisStore = RedisStoreFactory(expressSession);
const getSession = nextSession({
  name: process.env.COOKIE_NAME,
  store: promisifyStore(
    new RedisStore({
      client: new Redis({
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      }),
    })
  ),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  },
});
const server = new ApolloServer({
  schema: await buildSchema({
    resolvers: [UserResolver, PostResolver],
    validate: false,
  }),
  context: async ({ req, res }: MyContext) => ({
    req: { ...req, session: await getSession(req, res) },
    res,
    userLoader: createUserLoader(),
    postLoader: createPostLoader(),
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
    externalResolver: true,
  },
};
const startServer = server.start();
export default async function handler(req: any, res: any) {
  await startServer;
  await server.createHandler({ path: "/api/graphql" })(req, res);
}
