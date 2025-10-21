import { describe, test, expect } from "vitest";
import { createProject } from "./create-project.js";
import { MokedProjectService } from "../../services/mocks/mock-project-service.js";


describe("CreateProject", async () => {

    const projectService = MokedProjectService();

    test("should create a project", async () => {
        const newProject = {
            id: "2",
            name: "Project 2",
            description: "Description 2",
            ownerId: "1",
            members: [],
            createdAt: new Date(),
            updatedAt: new Date()
        }

        const result = await createProject(
            {
                dependencies: { projectService },
                payload: { project: newProject }
            }
        );

        expect(result.isSuccess).toBe(true);
        expect(result.project).toBeDefined();
    });

    test("should return error if existing project name", async () => {
        const newProject = {
            id: "1",
            name: "Project 1",
            description: "Description 1",
            ownerId: "1",
            members: [],
            createdAt: new Date(),
            updatedAt: new Date()
        }

        const result = await createProject(
            {
                dependencies: { projectService },
                payload: { project: newProject }
            }
        );

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Project name already exists");
    });

    test("should return error if project name is empty", async () => {
        const newProject = {
            id: "1",
            name: "",
            description: "Description 1",
            ownerId: "1",
            members: [],
            createdAt: new Date(),
            updatedAt: new Date()
        }

        const result = await createProject(
            {
                dependencies: { projectService },
                payload: { project: newProject }
            }
        );

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Project name is required");
    });

});