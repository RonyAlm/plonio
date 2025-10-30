import { describe, test, expect, beforeAll } from "vitest";
import { MokedProjectService } from "../../services/mocks/mock-project-service.js";
import { Member } from "../../entities/member.js";
import { MokedUserService } from "../../services/mocks/mock-user-service.js";
import { inviteUserToProject } from "./invite-user-to-project.js";
import { UserRole } from "../../entities/user.js";
import { MokedInvitationService } from "../../services/mocks/mock-invitation-service.js";

describe("InviteUserToProject", async () => {

    const projectService = MokedProjectService();
    const userService = MokedUserService();
    const invitationService = MokedInvitationService();

    const dependencies = {
        projectService,
        userService,
        invitationService
    }

    beforeAll(() => {

        userService.save({
            id: "id-user-1",
            email: "rony@rony.com",
            name: "Rony",
            password: "123456893",
            role: UserRole.ADMIN,
            createdAt: new Date(),
            updatedAt: new Date()
        })

        userService.save({
            id: "id-user-2",
            email: "user2@user2.com",
            name: "User 2",
            password: "123456893",
            role: UserRole.USER,
            createdAt: new Date(),
            updatedAt: new Date()
        })

        invitationService.create({
            id: "id-invitation-1",
            projectId: "1",
            invitedBy: "admin-2",
            invitedUserId: "id-user-2",
            role: "EDITOR",
            status: "pending",
            createdAt: new Date(),
            updatedAt: new Date()
        })


        const members = [{ id: "id-member-1", projectId: "1", userId: "id-user-1", role: "USER", createdAt: new Date(), updatedAt: new Date() }];

        const newProject = {
            id: "id-project-1",
            name: "Projecto de prueba",
            description: "Description 1",
            ownerId: "admin-2",
            members: members as Member[],
            createdAt: new Date(),
            updatedAt: new Date()
        }

        projectService.save(newProject);

    });

    test("should invite user to project", async () => {
        const result = await inviteUserToProject(
            {
                dependencies: dependencies,
                payload: {
                    projectId: "id-project-1",
                    invitedBy: "admin-2",
                    invitedUserId: "user-1",
                    role: "EDITOR"
                }
            }
        );

        expect(result.isSuccess).toBe(true);
    });

    test("should return error if invitedBy is empty or not exists", async () => {
        const result = await inviteUserToProject(
            {
                dependencies: dependencies,
                payload: {
                    projectId: "id-project-1",
                    invitedBy: "",
                    invitedUserId: "user-1",
                    role: "EDITOR"
                }
            }
        );

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Missing credentials");
    });

    test("should return error if project not found", async () => {
        const result = await inviteUserToProject(
            {
                dependencies: dependencies,
                payload: {
                    projectId: "id-projecto-no-existente",
                    invitedBy: "admin-2",
                    invitedUserId: "user-1",
                    role: "EDITOR"
                }
            }
        )

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Project not found");
    });

    test("should return error if project id is empty", async () => {
        const result = await inviteUserToProject(
            {
                dependencies: dependencies,
                payload: {
                    projectId: "",
                    invitedBy: "admin-2",
                    invitedUserId: "user-2",
                    role: "EDITOR"
                }
            }
        );

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe(
            "Project id is required"
        )
    });

    test("should return error if invitedUserId is empty or not exists", async () => {
        const result = await inviteUserToProject(
            {
                dependencies: dependencies,
                payload: {
                    projectId: "id-project-1",
                    invitedBy: "admin-2",
                    invitedUserId: "",
                    role: "EDITOR"
                }
            }
        );

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe(
            "User not found"
        )
    });

    test("should return error if the owner or member is not an admin or manager", async () => {
        const result = await inviteUserToProject(
            {
                dependencies: dependencies,
                payload: {
                    projectId: "id-project-1",
                    invitedBy: "id-user-1",
                    invitedUserId: "user-1",
                    role: "EDITOR"
                }
            }
        )

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Only admin or manager can invite users");
    });

    test("should return error if role is invalid", async () => {
        const result = await inviteUserToProject(
            {
                dependencies: dependencies,
                payload: {
                    projectId: "id-project-1",
                    invitedBy: "admin-2",
                    invitedUserId: "user-1",
                    role: "INVALID_ROLE" as UserRole
                }
            }
        );

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe(
            "Role not exists"
        )
    });

    test("should return error if user invited is already member of project", async () => {
        const result = await inviteUserToProject(
            {
                dependencies: dependencies,
                payload: {
                    projectId: "id-project-1",
                    invitedBy: "admin-2",
                    invitedUserId: "id-user-1",
                    role: "EDITOR"
                }
            }
        );

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe(
            "User is already member of project"
        )
    });

    test("should return error if user invited is already invited to project", async () => {
        const result = await inviteUserToProject(
            {
                dependencies: dependencies,
                payload: {
                    projectId: "id-project-1",
                    invitedBy: "admin-2",
                    invitedUserId: "id-user-2",
                    role: "EDITOR"
                }
            }
        );

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe(
            "User is already invited to project"
        )
    });

});