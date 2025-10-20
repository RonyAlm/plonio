import { DataSource } from "typeorm";
import UserEntity from "../entities/user.entity.js";
import path from "path";

export default async function createDb(dbFile = "./data/typeorm.db") {
  const dbPath = path.resolve(process.cwd(), dbFile);
  const dataSource = new DataSource({
    type: "sqlite",
    database: dbPath,
    entities: [UserEntity],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();

  return dataSource;
}