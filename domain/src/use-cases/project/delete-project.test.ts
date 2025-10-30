import { describe, test, expect, beforeAll } from "vitest";
import { MokedProjectService } from "../../services/mocks/mock-project-service.js";
import { Member } from "../../entities/member.js";
import { deleteProject } from "./delete-project.js";

describe("DeleteProject", async () => {

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

        const newProject2 = {
            id: "2",
            name: "Projecto de prueba 2",
            description: "Description 2",
            ownerId: "user-1",
            members: [],
            createdAt: new Date(),
            updatedAt: new Date()
        }

        projectService.save(newProject2);

    });

    test("should delete a project", async () => {
        const result = await deleteProject(
            {
                dependencies: dependencies,
                payload: { projectId: "2", userId: "user-1" }
            }
        );

        expect(result.isSuccess).toBe(true);
    });

    test("should return error if userId is empty or not exists", async () => {
        const result = await deleteProject(
            {
                dependencies: dependencies,
                payload: { projectId: "1", userId: "" }
            }
        );

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Missing credentials");
    });

    test("should return error if project not found", async () => {
        const result = await deleteProject(
            {
                dependencies: dependencies,
                payload: { projectId: "id-projecto-no-existente", userId: "admin-2" }
            }
        );

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Project not found");
    });

    test("should return error if not owner or member of project", async () => {
        const result = await deleteProject(
            {
                dependencies: dependencies,
                payload: { projectId: "1", userId: "user-2" }
            }
        );

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Not member or owner of project");
    });

});