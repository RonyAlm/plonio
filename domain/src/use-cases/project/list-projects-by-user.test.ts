import { describe, test, expect, should, beforeAll } from "vitest";
import { listProjectsByUser } from "./list-projects-by-user.js";
import { MokedProjectService } from "../../services/mocks/mock-project-service.js";
import { MokedUserService } from "../../services/mocks/mock-user-service.js";
import { Member } from "../../entities/member.js";

describe("ListProjectsByUser", async () => {

    const projectService = MokedProjectService();
    const userService = MokedUserService();

    const dependencies = {
        projectService: projectService,
        userService: userService
    }

    beforeAll(() => {

        userService.save({
            id: "user-2",
            email: "user.2@user.com",
            name: "User Dos",
            password: "123456dys",
            role: "USER",
            createdAt: new Date(),
            updatedAt: new Date()
        })

        userService.save({
            id: "user-3",
            email: "user.3@user.com",
            name: "User Tres",
            password: "123456dys",
            role: "USER",
            createdAt: new Date(),
            updatedAt: new Date()
        })

        const members: Member[] = [
            { id: "member-id-1", projectId: "1", userId: "user-3", role: "MANAGER", createdAt: new Date(), updatedAt: new Date() },
            { id: "member-id-2", projectId: "1", userId: "user-2", role: "USER", createdAt: new Date(), updatedAt: new Date() },
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

    test("should list projects by user", async () => {
        const result = await listProjectsByUser({
            dependencies: dependencies,
            payload: {
                userId: "user-1"
            }
        });

        expect(result.isSuccess).toBe(true);
        expect(result.isSuccess && result.projects).toBeDefined();
    });

    test("should return error if userId not exists", async () => {
        const result = await listProjectsByUser({
            dependencies: dependencies,
            payload: {
                userId: "user-not-found/2"
            }
        });

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Missing credentials");
    });

    test("should return error if userId is empty", async () => {
        const result = await listProjectsByUser({
            dependencies: {
                projectService: projectService,
                userService: userService
            },
            payload: {
                userId: ""
            }
        });

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Missing credentials");
    });

    test("should return success if userId is member of project", async () => {
        const result = await listProjectsByUser({
            dependencies: dependencies,
            payload: {
                userId: "user-2"
            }
        });

        expect(result.isSuccess).toBe(true);
        expect(result.isSuccess && result.projects).toBeDefined();
    });

});