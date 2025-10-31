

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Relation,
} from "typeorm";
import { UserEntity } from "./user.entity.js";
import { MemberEntity } from "./member.entity.js";

@Entity("projects")
export class ProjectEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => UserEntity, (user) => user.projects)
  @JoinColumn({ name: "ownerId" })
  owner: Relation<UserEntity> | undefined;

  @OneToMany(() => MemberEntity, (member) => member.project, {
    cascade: true,
  })
  members?: Relation<MemberEntity>[] | MemberEntity[];

  @CreateDateColumn({ name: "createdAt" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updatedAt" })
  updatedAt!: Date;
}
