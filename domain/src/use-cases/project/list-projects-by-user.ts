import { Project } from "../../entities/project.js"
import { ProjectService } from "../../services/project-service.js"
import { UserService } from "../../services/user-service.js"

export interface ListProjectsByUserParams {
    dependencies: {
        projectService: ProjectService,
        userService: UserService
    },
    payload: {
        userId: string
    }
}

type ListProjectsByUserResult = Promise<{ isSuccess: boolean, projects?: Project[] | Project, error?: string }>

export async function listProjectsByUser({ dependencies, payload }: ListProjectsByUserParams): ListProjectsByUserResult {

    const { projectService, userService } = dependencies;
    const { userId } = payload;
    const existsUser = await userService.findById(userId);
    if (!userId || !existsUser) return { isSuccess: false, error: "Missing credentials" };

    const projects = await projectService.findByUserId(userId);
    if (!projects) return { isSuccess: false, error: "Projects not found" };

    return {
        isSuccess: true,
        projects: projects
    }
}