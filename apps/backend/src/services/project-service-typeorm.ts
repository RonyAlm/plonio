import { UserEntity } from '../models/typeorm/user.entity.js'
import { Project, User, UserRole, UserSecure } from '../../../../domain/dist/index.js'
import { AppDataSource } from '../utils/conexionDB.js';
import { ProjectService } from '../../../../domain/dist/services/project-service.js';
import { ProjectEntity } from '../models/typeorm/project.entity.js';
import { MemberEntity } from '../models/typeorm/member.entity.js';
import { DeepPartial } from 'typeorm';

const projectRepo = AppDataSource.getRepository(ProjectEntity);

export class ProjectServiceTypeorm implements ProjectService {

    // findByUserId: (id: string) => Promise<Project[] | undefined>
    // findById: (id: string) => Promise<Project | undefined>
    // findByName: (name: string) => Promise<Project | undefined>
    // getAll: () => Promise<Project[] | undefined>
    // save: (project: Project) => Promise<Project | null>
    // update: (project: Project) => Promise<Project | null>
    // delete: (id: string) => Promise<object | null>

    async getAll(): Promise<any[]> {
        const projects = await AppDataSource.getRepository(ProjectEntity).find();
        return projects;
    }

    async findById(id: string): Promise<Project | any> {
        const project = await projectRepo.findOne({ where: { id: id }, relations: ["members", "members.user", "owner"] });
        if (!project) throw new Error('Project not found');
        return {
            id: project.id as string,
            name: project.name,
            description: project.description,
            ownerId: project.owner?.id as string,
            createdAt: project.createdAt as Date,
            updatedAt: project.updatedAt as Date,
            members: project.members
        };
    }

    async findByName(name: string): Promise<any> {
        const project = await AppDataSource.getRepository(ProjectEntity).findOne({ where: { name: name } });
        return project;
    }

    async findByUserId(id: string): Promise<Project[]> {
        const projects = await projectRepo.find({
            where: { owner: { id: id } },
            relations: ["members", "members.user", "owner"]
        });

        return projects && projects.map((project) => ({
            id: project.id as string,
            name: project.name,
            description: project.description,
            ownerId: project.owner?.id as string
        })) as Project[]
    }

    async save(project: Project): Promise<Project> {

        const projectEntity = projectRepo.create({
            id: project.id,
            name: project.name,
            description: project.description,
            owner: { id: project.ownerId } as UserEntity,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
        } as DeepPartial<ProjectEntity>);

        const saved = await projectRepo.save(projectEntity);

        const projectDomain = {
            id: saved.id as string,
            name: saved.name,
            description: saved.description,
            ownerId: saved.owner?.id as string,
            createdAt: saved.createdAt as Date,
            updatedAt: saved.updatedAt as Date,
            members: [],
        } as Project;

        return projectDomain;
    }

    async update(project: any): Promise<Omit<Project, "members">> {
        const projectEntity = projectRepo.create({
            id: project.id,
            name: project.name,
            description: project.description,
            owner: { id: project.ownerId } as UserEntity,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
        } as DeepPartial<ProjectEntity>);

        const updated = await projectRepo.update(project.id, projectEntity);

        const projectUpdated = await projectRepo.findOne({ where: { id: project.id }, relations: ["members", "members.user", "owner"] });

        return {
            id: project.id,
            name: projectUpdated?.name as string,
            description: projectUpdated?.description,
            ownerId: projectUpdated?.owner?.id as string,
            updatedAt: projectUpdated?.updatedAt as Date
        } as Omit<Project, "members">;
    }

    async delete(id: string): Promise<object> {
        const deletedProject = projectRepo.delete(id);
        return deletedProject;
    }
}