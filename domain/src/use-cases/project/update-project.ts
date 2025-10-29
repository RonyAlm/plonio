import { Project } from "../../entities/project.js"
import { ProjectService } from "../../services/project-service.js"
import { isValidName } from "../../utils/validations.js";

export interface UpdateProjectParams {
    dependencies: {
        projectService: ProjectService
    },
    payload: {
        projectId: string;
        userId: string;
        project: Project;
    }
}

type UpdateProjectResult = Promise<{ isSuccess: boolean, project?: Partial<Project>, error?: string }>

export async function updateProject({ dependencies, payload }: UpdateProjectParams): UpdateProjectResult {

    const { projectService } = dependencies;
    const { projectId, userId, project } = payload;

    if (!userId) return { isSuccess: false, error: "Missing credentials" };

    if (!projectId) return { isSuccess: false, error: "Project id is required" };

    const existingProject = await projectService.findById(projectId);
    if (!existingProject) return { isSuccess: false, error: "Project not found" };

    const isMember = existingProject?.members && existingProject.members.length > 0 && existingProject.members.find((member) => member.userId === userId);

    const IsMemberOrOwner = isMember || existingProject.ownerId === userId;

    if (!IsMemberOrOwner) return { isSuccess: false, error: "Not member or owner of project" };

    if (!isValidName(project.name)) return { isSuccess: false, error: "Invalid project name" };

    const projectUpdated = await projectService.update({ ...existingProject, ...project, updatedAt: new Date() });
    if (!projectUpdated) return { isSuccess: false, error: "Error updating project" };

    return {
        isSuccess: true,
        project: projectUpdated
    }
}