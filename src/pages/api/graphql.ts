import "reflect-metadata";
import dotenv from "dotenv";
import nextSession from "next-session";
import { expressSession, promisifyStore } from "next-session/lib/compat";
import RedisStoreFactory from "connect-redis";
import Redis from "ioredis";

dotenv.config();

const RedisStore = RedisStoreFactory(expressSession);
const getSession = nextSession({
  name: process.env.COOKIE_NAME,
  store: promisifyStore(
    new RedisStore({
      client: new Redis({
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || ""),
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
console.log("Redis created");
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
export default async function handler(req: any, res: any) {
}
