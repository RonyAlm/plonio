import { Project } from "../../entities/project.js";
import { ProjectService } from "../project-service.js";

export function MokedProjectService(): ProjectService {
  const projects: Project[] = [];

  return {
    async save(project) {
      projects.push(project);
      return project;
    },

    async findById(id) {
      return projects.find(p => p.id === id) ?? undefined;
    },

    async findByName(name) {
      return projects.find(p => p.name === name) ?? undefined;
    },

    async findByUserId(id) {
      return projects.filter(p =>
        p.ownerId === id || p.members?.some(m => m.userId === id)
      );
    },

    async getAll() {
      return [...projects]; // devolver copia para evitar mutaciones externas
    },

    async update(project) {
      const index = projects.findIndex(p => p.id === project.id);
      if (index === -1) return null;
      projects[index] = project;
      return project;
    },

    async delete(id) {
      const index = projects.findIndex(p => p.id === id);
      if (index === -1) return null;
      projects.splice(index, 1);
      return { id };
    }
  };
}
