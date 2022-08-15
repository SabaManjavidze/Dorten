import { DataSourceOptions } from "typeorm";
import { User } from "./entities/User";

export const config: DataSourceOptions = {
  type: "mysql",
  host: "localhost",
  port: 3309,
  username: "root",
  password: "",
  // username: process.env.DB_USERNAME,
  // password: process.env.DB_PASSWORD,
  database: "dorten",
  logging: false,
  synchronize: true,
  entities: [User],
  migrations: ["src/migrations"],
};
