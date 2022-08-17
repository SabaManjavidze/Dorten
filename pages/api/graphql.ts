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
import * as argon2 from "argon2";

dotenv.config();

const RedisStore = RedisStoreFactory(expressSession);
export const getSession = nextSession({
  name: "sabaId",
  store: promisifyStore(
    new RedisStore({
      client: new Redis(),
    })
  ),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  },
  encode: (rawSid) => {
    let encoded = "";
    argon2
      .hash(rawSid, {
        hashLength: 16,
        secret: Buffer.from(process.env.SESSION_SECRET),
      })
      .then((hash) => {
        encoded = hash.toString();
      });
    return encoded;
  },
  decode: (encodedSid) => {
    let rawSid = "";
    argon2
      .verify(encodedSid, null, {
        secret: Buffer.from(process.env.SESSION_SECRET),
      })
      .then((hash) => {
        rawSid = hash.toString();
      })
      .catch((err) => {
        console.log(err);
      });
    return rawSid;
  },
});
const server = new ApolloServer({
  schema: await buildSchema({
    resolvers: [UserResolver, PostResolver],
    validate: false,
  }),
  context: ({ req, res }): MyContext => ({
    req: { ...req, session: getSession(req, res) },
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
  },
};
const startServer = server.start();
export default async function handler(req: any, res: any) {
  await startServer;
  await server.createHandler({ path: "/api/graphql" })(req, res);
}
