import { Project } from "../../entities/project.js";
import { ProjectService } from "../project-service.js";

const idGenerator = () => crypto.randomUUID();


export function MokedProjectService(): ProjectService {
    const projects: Project[] = [
        {
            id: "1",
            name: "Project 1",
            description: "Description 1",
            ownerId: "1",
            members: [],
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: "2234",
            name: "Plonio",
            description: "Description Plonio",
            ownerId: "1",
            members: [],
            createdAt: new Date(),
            updatedAt: new Date()
        }

    ];

    return {
        async save(project) {
            projects.push(project);
            return project;
        },
        async findById(id) {
            return projects.find((project) => project.id === id);
        },
        async findByName(name) {
            return projects.find((project) => project.name === name);
        },
        async findByUserId(id) {
            return projects.filter((project) => project.ownerId === id) || [];
        },
        async getAll() {
            return projects
        },
        async update(project) {
            const index = projects.findIndex((project) => project.id === project.id);
            if (index === -1) return null;
            projects[index] = project;
            return project;
        },

        async delete(id) {
            const index = projects.findIndex((project) => project.id === id);
            if (index === -1) return null;
            projects.splice(index, 1);
            return { id };
        }

    };
};