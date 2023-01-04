import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "info"] : undefined,
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
export const UserFragment = {
  username: true,
  picture: true,
  gender: true,
  age: true,
  user_id: true,
};
