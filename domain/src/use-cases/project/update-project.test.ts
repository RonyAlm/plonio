import { describe, test, expect, beforeAll } from "vitest";
import { MokedProjectService } from "../../services/mocks/mock-project-service.js";
import { Member } from "../../entities/member.js";
import { updateProject } from "./update-project.js";

describe("UpdateProject", async () => {

    const projectService = MokedProjectService();
    const dependencies = {
        projectService
    }

    beforeAll(() => {
        const members: Member[] = [
            { id: "2", projectId: "1", userId: "user-3", role: "USER", createdAt: new Date(), updatedAt: new Date() },
        ];

        const newProject = {
            id: "1",
            name: "Projecto de prueba",
            description: "Description 1",
            ownerId: "admin-2",
            members: members,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        projectService.save(newProject);

    });

    test("should update a project", async () => {
        const result = await updateProject(
            {
                dependencies: dependencies,
                payload: { projectId: "1", userId: "admin-2", project: { name: "projecto actualizado" } }
            }
        );

        expect(result.isSuccess).toBe(true);
        expect(result.isSuccess && result.project).toBeDefined();
        expect(result.isSuccess && result.project && result.project.name).toBe("projecto actualizado");
    });

    test("should return error if userId is empty or not exists", async () => {
        const result = await updateProject(
            {
                dependencies: dependencies,
                payload: { projectId: "1", userId: "", project: { name: "projecto actualizado" } }
            }
        );

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Missing credentials");
    });

    test("should return error if project not found", async () => {
        const result = await updateProject(
            {
                dependencies: dependencies,
                payload: { projectId: "id-projecto-no-existente", userId: "admin-2", project: { name: "projecto actualizado" } }
            }
        );

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Project not found");
    });

    test("should return error if not owner or member of project", async () => {
        const result = await updateProject(
            {
                dependencies: dependencies,
                payload: { projectId: "1", userId: "user-2", project: { name: "projecto actualizado" } }
            }
        );

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Not member or owner of project");
    });

    test("should return error if project id is empty", async () => {
        const result = await updateProject(
            {
                dependencies: dependencies,
                payload: { projectId: "", userId: "admin-2", project: { name: "projecto actualizado" } }
            }
        );

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Project id is required");
    });

    test("should return error if project name is empty or invalid", async () => {
        const result = await updateProject(
            {
                dependencies: dependencies,
                payload: { projectId: "1", userId: "admin-2", project: { name: "" } }
            }
        );

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Invalid project name");
    });

});