

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Relation,
  OneToOne,
  OneToMany,
} from "typeorm";
import { UserEntity } from "./user.entity.js";
import { ProjectEntity } from "./project.entity.js";
import { join } from "path";

export type MemberRole = "VIEWER" | "EDITOR" | "ADMIN" | "MANAGER";

@Entity("members")
export class MemberEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  role!: MemberRole;

  @ManyToOne(() => ProjectEntity, (project) => project.members, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "projectId" })
  project: Relation<ProjectEntity> | undefined;

  @ManyToOne(() => UserEntity, (user) => user.memberships, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user!: Relation<UserEntity> | undefined;

  @CreateDateColumn({ name: "createdAt" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt!: Date;
}
