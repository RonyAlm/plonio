import { Project } from "../../entities/project.js"
import { ProjectService } from "../../services/project-service.js"
import { isValidName } from "../../utils/validations.js"

interface CreateProjectParams {
    dependencies: {
        projectService: ProjectService
    }
    payload: {
        userId: string,
        project: Project
    }
}

type CreateProjectResult = Promise<{ isSuccess: boolean, project?: Project, error?: string}>

export async function createProject({ dependencies, payload } : CreateProjectParams ) : CreateProjectResult {
    const { projectService } = dependencies;
    const { userId, project } = payload;

    if (!userId) return { isSuccess: false, error: "Missing credentials" };
    if (project.ownerId) return { isSuccess: false, error: "Cannot add ownerId to project" };
    
    if (!isValidName(project.name)) return { isSuccess: false, error: "Invalid project name" };
    
    const existingProject = await projectService.findByName(project.name);
    if (existingProject) return { isSuccess: false, error: "Project name already exists" };
    
    
    const projectData: Project = {
        id: project.id || crypto.randomUUID(),
        name: project.name,
        description: project.description ?? "",
        ownerId: userId,
        members: [],
        createdAt:  new Date(),
        updatedAt: new Date()
    }
    const projectSaved = await projectService.save(projectData);
    if (!projectSaved) return { isSuccess: false, error: "Error creating project" };
    
    return { isSuccess: true, project: projectSaved }; 
}