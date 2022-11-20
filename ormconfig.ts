import { DataSourceOptions } from "typeorm";
import { Post } from "./src/entities/Post";
import { User } from "./src/entities/User";
import dotenv from "dotenv";
import { Like } from "./src/entities/Like";
import { Account } from "./src/entities/Account";
import { Comment } from "./src/entities/Comment";

dotenv.config();
export const config: DataSourceOptions = {
  type: "postgres",
  url: process.env.DB_URL,
  logging: false,
  synchronize: true,
  entities: [User, Post, Like, Account, Comment],
  migrations: ["src/migrations"],
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
};
