import { Project } from "../../entities/Project.js"
import { ProjectService } from "../../services/project-service.js"

interface CreateProjectParams {
    dependencies: {
        projectService: ProjectService
    }
    payload: {
        project: Project
    }
}

type CreateProjectResult = Promise<{ isSuccess: boolean, project?: Project, error?: string}>

export async function createProject({ dependencies, payload } : CreateProjectParams ) : CreateProjectResult {

    
    if (payload.project.name === "") return { isSuccess: false, error: "Project name is required" };
    
    const existingProject = await dependencies.projectService.findByName(payload.project.name);
    if (existingProject) return { isSuccess: false, error: "Project name already exists" };

    const project = await dependencies.projectService.save(payload.project);
    if (!project) return { isSuccess: false, error: "Error creating project" };
    
    const projectResponse: Project = {
        id: project.id || crypto.randomUUID(),
        name: project.name,
        description: project.description ?? "",
        ownerId: project.ownerId,
        members: [],
        createdAt:  new Date(),
        updatedAt: new Date()
    }

    return { isSuccess: true, project: projectResponse }; 
}