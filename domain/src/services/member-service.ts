import { Member } from "../entities/member.js";

export interface MemberService {
  addMember: (data: Member) => Promise<Member>;
  findByProjectId: (projectId: string) => Promise<Member[]>;
  findByUserAndProject: (userId: string, projectId: string) => Promise<Member | undefined>;
  removeMember: (id: string) => Promise<object | null>;
  updateRole: (id: string, role: string) => Promise<Member | null>;
}