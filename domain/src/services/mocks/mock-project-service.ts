import { Member } from "../../entities/member.js";
import { Project } from "../../entities/project.js";
import { MemberService } from "../member-service.js";
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

export function MokedMemberService(): MemberService {
  const members: Member[] = [];
  return {
    async findByProjectId(projectId) {
      return members.filter(m => m.projectId === projectId);
    },
    async findByUserAndProject(userId, projectId) {
      return members.find(m => m.userId === userId && m.projectId === projectId);
    },
    async addMember(member) {
      members.push(member);
      return member;
    },
    async removeMember(id) {
      const index = members.findIndex(m => m.id === id);
      if (index === -1) return null;
      members.splice(index, 1);
      return { id };
    },
    async updateRole(id, role) {
      const index = members.findIndex(m => m.id === id);
      if (index === -1) return null;
      if (!members[index]) return null;
      members[index].role = role as Member["role"];
      return members[index];
    }
  }
}
