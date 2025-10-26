import { Project } from "../entities/project.js";

export interface ProjectService {
    findByUserId: (id: string) => Promise<Project[] | undefined>
    findById: (id: string) => Promise<Project | undefined>
    findByName: (name: string) => Promise<Project | undefined>
    getAll: () => Promise<Project[] | undefined>
    save: (project: Project) => Promise<Project | null>
    update: (project: Project) => Promise<Project | null>
    delete: (id: string) => Promise<object | null>
}