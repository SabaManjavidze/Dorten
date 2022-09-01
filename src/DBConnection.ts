import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { config } from "../ormconfig";
dotenv.config();

const dataSource = new DataSource(config);
try {
  await dataSource.initialize();
  console.log("Connected to Postgres🐘");
} catch (err) {
  console.error("Error during Data Source initialization", err);
}
export default dataSource;
