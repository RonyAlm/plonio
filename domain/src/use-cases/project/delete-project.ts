import { ProjectService } from "../../services/project-service.js"

export interface DeleteProjectParams {
    dependencies: {
        projectService: ProjectService
    },
    payload: {
        projectId: string;
        userId: string;
    }
}

type DeleteProjectResult = Promise<{ isSuccess: boolean, error?: string }>

export async function deleteProject({ dependencies, payload }: DeleteProjectParams): DeleteProjectResult {

    const { projectService } = dependencies;
    const { projectId, userId } = payload;

    if (!userId) return { isSuccess: false, error: "Missing credentials" };

    if (!projectId) return { isSuccess: false, error: "Project id is required" };

    const project = await projectService.findById(projectId);
    if (!project) return { isSuccess: false, error: "Project not found" };

    const isMember = project?.members && project.members.length > 0 && project.members.find((member) => member.userId === userId);
    const IsMemberOrOwner = isMember || project.ownerId === userId;

    if (!IsMemberOrOwner) return { isSuccess: false, error: "Not member or owner of project" };

    await projectService.delete(projectId);

    return { isSuccess: true }
}