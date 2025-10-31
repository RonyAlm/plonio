import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Relation
} from "typeorm";
import { ProjectEntity } from "./project.entity.js";
import { MemberEntity } from "./member.entity.js";

export type UserRole = "ADMIN" | "USER" | "EDITOR" | "MANAGER" | "VIEWER";

@Entity("users")
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column({ type: "text", default: "user" })
    role!: UserRole;

    @OneToMany(() => ProjectEntity, (project) => project.owner)
    projects: Relation<ProjectEntity>[] | ProjectEntity[]

    @OneToMany(() => MemberEntity, (member) => member.user)
    memberships: Relation<MemberEntity>[] | MemberEntity[]

    @CreateDateColumn({ name: "createdAt" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updatedAt" })
    updatedAt!: Date;
}



