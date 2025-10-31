import { DataSource } from "typeorm";
import { ProjectEntity } from "../models/typeorm/project.entity.js";
import { UserEntity } from "../models/typeorm/user.entity.js";
import { MemberEntity } from "../models/typeorm/member.entity.js";

 export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "./data/typeorm.db",
    entities: [ProjectEntity, UserEntity, MemberEntity],
    synchronize: true,
    logging: true,
  });