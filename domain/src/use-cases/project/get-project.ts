import { Project } from "../../entities/project.js"
import { ProjectService } from "../../services/project-service.js"

export interface GetProjectParams {
    dependencies: {
        projectService: ProjectService
    },
    payload: {
        projectId: string;
        userId: string;
    }
}

type GetProjectResult = Promise<{ isSuccess: boolean, project?: Partial<Project>, error?: string }>

export async function getProject({ dependencies, payload }: GetProjectParams): GetProjectResult {

    const { projectService } = dependencies;
    const { projectId, userId } = payload;

    if (!userId) return { isSuccess: false, error: "Missing credentials" };

    if (!projectId) return { isSuccess: false, error: "Project id is required" };

    const project = await projectService.findById(projectId);
    if (!project) return { isSuccess: false, error: "Project not found" };

    const isMember = project?.members && project.members.length > 0 && project.members.find((member) => member.userId === userId);
    
    const IsMemberOrOwner = isMember || project.ownerId === userId;

    if (!IsMemberOrOwner) return { isSuccess: false, error: "Not member or owner of project" };

    return {
        isSuccess: true,
        project
    }
}