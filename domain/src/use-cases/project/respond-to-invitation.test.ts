import { describe, test, expect, beforeAll } from "vitest";
import { MokedMemberService, MokedProjectService } from "../../services/mocks/mock-project-service.js";
import { MokedUserService } from "../../services/mocks/mock-user-service.js";
import { UserRole } from "../../entities/user.js";
import { MokedInvitationService } from "../../services/mocks/mock-invitation-service.js";
import { respondToInvitation } from "./respond-to-invitation.js";
import { InvitationStatus } from "../../entities/invitation.js";

describe("RespondToInvitation", async () => {

    const projectService = MokedProjectService();
    const userService = MokedUserService();
    const invitationService = MokedInvitationService();
    const memberService = MokedMemberService();

    const dependencies = {
        projectService,
        invitationService,
        memberService
    }

    beforeAll(() => {

        userService.save({
            id: "id-user-1",
            email: "rony@rony.com",
            name: "Rony",
            password: "123456893",
            role: UserRole.USER,
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
            projectId: "id-project-1",
            invitedBy: "admin-2",
            invitedUserId: "id-user-1",
            role: "EDITOR",
            status: "pending",
            createdAt: new Date(),
            updatedAt: new Date()
        })

        invitationService.create({
            id: "id-invitation-2",
            projectId: "id-project-1",
            invitedBy: "admin-2",
            invitedUserId: "id-user-2",
            role: "EDITOR",
            status: "pending",
            createdAt: new Date(),
            updatedAt: new Date()
        })

        const newProject = {
            id: "id-project-1",
            name: "Projecto de prueba",
            description: "Description 1",
            ownerId: "admin-2",
            members: [],
            createdAt: new Date(),
            updatedAt: new Date()
        }

        projectService.save(newProject);

    });

    test("should respond to invitation", async () => {
        const result = await respondToInvitation(
            {
                dependencies: dependencies,
                payload: {
                    invitationId: "id-invitation-1",
                    userId: "id-user-1",
                    response: InvitationStatus.ACCEPTED
                }
            }
        );

        // expect(result.isSuccess).toBe(true);
        expect(result.message).toBe("Invitation accepted");
    });

    test("should return error of credentials if userId is empty or not exists", async () => {
        const result = await respondToInvitation(
            {
                dependencies: dependencies,
                payload: {
                    invitationId: "id-invitation-1",
                    userId: "",
                    response: InvitationStatus.ACCEPTED
                }
            }
        )

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Missing credentials");
    });

    test("should return error if invitation not found", async () => {
        const result = await respondToInvitation(
            {
                dependencies: dependencies,
                payload: {
                    invitationId: "id-invitation-no-existente",
                    userId: "id-user-1",
                    response: InvitationStatus.ACCEPTED
                }
            }
        )

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Invitation not found");
    });

    test("should return error if selected response status is invalid or not exists", async () => {
        const result = await respondToInvitation(
            {
                dependencies: dependencies,
                payload: {
                    invitationId: "id-invitation-1",
                    userId: "id-user-1",
                    response: "invalid" as InvitationStatus
                }
            }
        )

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Status not found");
    })

    test("should return message if invitation rejected", async () => {
        const result = await respondToInvitation(
            {
                dependencies: dependencies,
                payload: {
                    invitationId: "id-invitation-2",
                    userId: "id-user-2",
                    response: InvitationStatus.REJECTED
                }
            }
        )

        expect(result.isSuccess).toBe(true);
        expect(result.message).toBe("Invitation rejected");
    })

    test("should return the members of the project if invitation accepted", async () => {
        const result = await respondToInvitation(
            {
                dependencies: dependencies,
                payload: {
                    invitationId: "id-invitation-1",
                    userId: "id-user-1",
                    response: InvitationStatus.ACCEPTED
                }
            }
        )

        expect(result.isSuccess).toBe(true);
        expect(result.message).toBe("Invitation accepted");
        expect(result.isSuccess && result.project).toBeDefined();
    })

});