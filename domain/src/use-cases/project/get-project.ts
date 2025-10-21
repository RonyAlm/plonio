import { Project } from "../../entities/Project.js"
import { ProjectService } from "../../services/project-service.js"

export interface GetProjectParams {
    dependencies: {
        projectService: ProjectService
    },
    payload: {
        id: string
    }
}

type GetProjectResult = Promise<{ isSuccess: boolean, project?: Partial<Project>, error?: string}>

export async function getProject({ dependencies, payload } : GetProjectParams) : GetProjectResult {

   if (payload.id === "") {
       return { isSuccess: false, error: "Project id is required" };
   }

   const project = await dependencies.projectService.findById(payload.id)

   if (!project) {
       return { isSuccess: false, error: "Project not found" };
   }

   return {
       isSuccess: true,
       project
   }
}