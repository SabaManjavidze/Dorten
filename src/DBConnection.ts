import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { config } from "../ormconfig";
dotenv.config();
export const AppDataSource = new DataSource(config);

try {
  await AppDataSource.initialize();
  console.log("Connected to Postgres🐘");
} catch (err) {
  console.error("Error during Data Source initialization", err);
}
