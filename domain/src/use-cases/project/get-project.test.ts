import { describe, test, expect, beforeAll } from "vitest";
import { getProject } from "./get-project.js";
import { MokedProjectService } from "../../services/mocks/mock-project-service.js";
import { Member } from "../../entities/member.js";

describe("GetProject", async () => {

    const projectService = MokedProjectService();
    const dependencies = {
        projectService
    }

    beforeAll(() => {
        const members: Member[] = [
            { id: "1", projectId: "1", userId: "user-2", role: "MANAGER", createdAt: new Date(), updatedAt: new Date() },
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

    test("should get a project by id successfully", async () => {
        const result = await getProject(
            {
                dependencies: dependencies,
                payload: { projectId: "2", userId: "user-1" }
            }
        );

        expect(result.isSuccess).toBe(true);
        expect(result.isSuccess && result.project).toBeDefined();
        // expect(result.isSuccess && result.project && result.project.id).toBe("2");
    });

    test("should return error if userId is empty or not exists", async () => {
        const result = await getProject(
            {
                dependencies: dependencies,
                payload: { projectId: "1", userId: "" }
            }
        );

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Missing credentials");
    });

    test("should get error if project not found", async () => {
        const result = await getProject(
            {
                dependencies: dependencies,
                payload: { projectId: "4", userId: "admin-2" }
            }
        );

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Project not found");
    });

    test("should return error if project id is empty", async () => {
        const result = await getProject(
            {
                dependencies: dependencies,
                payload: { projectId: "", userId: "admin-2" }
            }
        );

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Project id is required");
    });

    test("should return error if not member or owner of project", async () => {
        const result = await getProject(
            {
                dependencies: dependencies,
                payload: { projectId: "2", userId: "admin-2" }
            }
        )

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Not member or owner of project");
    });

    test("should return success if is member of project", async () => {
        const result = await getProject(
            {
                dependencies: dependencies,
                payload: { projectId: "1", userId: "user-2" }
            }
        )

        expect(result.isSuccess).toBe(true);
        expect(result.isSuccess && result.project).toBeDefined();
    });
});