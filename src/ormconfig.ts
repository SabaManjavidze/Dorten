import { DataSourceOptions } from "typeorm";
import { User } from "./entities/User";
import { Post } from "./entities/Post";

export const config: DataSourceOptions = {
  type: "mysql",
  host: "localhost",
  port: 3309,
  username: "root",
  password: "",
  database: "dorten",
  logging: false,
  synchronize: true,
  entities: [User, Post],
  migrations: ["src/migrations"],
};
