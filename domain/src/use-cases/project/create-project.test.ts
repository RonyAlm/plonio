import { describe, test, expect, beforeAll } from "vitest";
import { createProject } from "./create-project.js";
import { MokedProjectService } from "../../services/mocks/mock-project-service.js";


describe("CreateProject", async () => {

    const projectService = MokedProjectService();
    const dependencies = { projectService };

    beforeAll(() => {
        const newProject = {
            id: "primer-proyecto-id",
            name: "Projecto de prueba",
            description: "Description 1",
            ownerId: "admin-2",
            members: [],
            createdAt: new Date(),
            updatedAt: new Date()
        }

        projectService.save(newProject);

    });

    test("should create a project success", async () => {
        const newProject = {
            name: "Otro proyecto",
            description: "Description 2"
        }

        const result = await createProject(
            {
                dependencies: dependencies,
                payload: { userId: "admin-2", project: newProject }
            }
        );

        expect(result.isSuccess).toBe(true);
        expect(result.project).toBeDefined();
    });

    test("should return error id userId is empty or not found", async () => {
        const newProject = {
            name: "Project 2",
            description: "Description 2"
        }

        const result = await createProject(
            {
                dependencies: dependencies,
                payload: { userId: "", project: newProject }
            }
        );

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Missing credentials");
    });

    test("should return error if project name is invalid", async () => {
        const newProject = {
            name: "",
            description: "Description 2"
        }

        const result = await createProject(
            {
                dependencies: dependencies,
                payload: { userId: "admin-2", project: newProject }
            }
        );

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe(
            "Invalid project name"
        )
    });

    test("should return error if existing project name", async () => {
        const newProject = {
            name: "Projecto de prueba",
            description: "Description 1"
        }

        const result = await createProject(
            {
                dependencies: dependencies,
                payload: { userId: "admin-2", project: newProject }
            }
        );

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Project name already exists");
    });

    test("should return error if attempt to add ownerId to project", async () => {
        const newProject = {
            name: "Projecto de prueba",
            description: "Description 1",
            ownerId: "admin-1"
        }

        const result = await createProject(
            {
                dependencies: dependencies,
                payload: { userId: "admin-2", project: newProject }
            }
        );

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe(
            "Cannot add ownerId to project"
        )
    })

});