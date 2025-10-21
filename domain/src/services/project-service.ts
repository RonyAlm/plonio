import { Project } from "../entities/Project.js";

export interface ProjectService {
    getById: (id: string) => Promise<Project | undefined>
    getAll: () => Promise<Project[]>
}