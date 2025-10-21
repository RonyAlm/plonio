import { ProjectService } from "../../services/project-service.js"

export interface GetProject {
    dependencies: {
        projectService: ProjectService
    },
    payload: {
        id: string
    }
}

export async function getProject({ dependencies, payload } : GetProject) {
   const project = await dependencies.projectService.getById(payload.id)

   if (!project) {
       return undefined
   }

   return {
       id: payload.id,
       name: project?.name,
       description: project?.description,
       ownerId: project?.ownerId,
       members: project?.members,
       createdAt: project?.createdAt,
       updatedAt: project?.updatedAt
   }
}