import { Invitation, InvitationStatus } from "../../entities/invitation.js";
import { UserRole } from "../../entities/user.js";
import { InvitationService } from "../../services/invitation-service.js";
import { ProjectService } from "../../services/project-service.js"
import { UserService } from "../../services/user-service.js";
export interface InviteUserParams {
    dependencies: {
        projectService: ProjectService,
        userService: UserService,
        invitationService: InvitationService
    },
    payload: {
        projectId: string;
        invitedBy: string;
        invitedUserId: string;
        role?: UserRole;
    }
}

type InviteUserResult = Promise<{
    isSuccess: boolean,
    message?: string,
    invitation?: Invitation
    error?: string
}>

export async function inviteUserToProject({ dependencies, payload }: InviteUserParams): InviteUserResult {

    const { projectService, userService, invitationService } = dependencies;
    const { projectId, invitedBy, invitedUserId } = payload;

    if (!invitedBy) return { isSuccess: false, error: "Missing credentials" };

    if (!projectId) return { isSuccess: false, error: "Project id is required" };
    const existingProject = await projectService.findById(projectId);
    if (!existingProject) return { isSuccess: false, error: "Project not found" };

    const existingUser = await userService.findById(invitedUserId);
    if (!existingUser) return { isSuccess: false, error: "User not found" };

    const invitedByUserIsMember =
        existingProject?.members &&
        existingProject.members.length > 0 &&
        existingProject.members.find((member) =>
            member.userId === invitedBy && member.role === "ADMIN" || member.role === "MANAGER");

    const invitedByUserIsOwnerOrMember = invitedByUserIsMember || existingProject.ownerId === invitedBy;
    if (!invitedByUserIsOwnerOrMember) return { isSuccess: false, error: "Only admin or manager can invite users" };

    const existingRole = payload.role && Object.values(UserRole).includes(payload.role as UserRole);
    if (!existingRole) return { isSuccess: false, error: "Role not exists" };

    const invitedUserIsMember =
        existingProject?.members &&
        existingProject.members.length > 0 &&
        existingProject.members.find((member) => member.userId === invitedUserId);

    if (invitedUserIsMember) return { isSuccess: false, error: "User is already member of project" };

    const invitedUserIsInvited = await invitationService.findByUserId(invitedUserId);
    if (invitedUserIsInvited && invitedUserIsInvited?.length > 0) return { isSuccess: false, error: "User is already invited to project" };

    const createdInvitation = await invitationService.create({
        id: crypto.randomUUID() as string,
        projectId: projectId,
        invitedBy: invitedBy,
        invitedUserId: invitedUserId,
        role: payload.role as UserRole,
        status: InvitationStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date()
    }) as Invitation;

    return {
        isSuccess: true,
        message: "Invitation sent successfully",
        invitation: createdInvitation
    }
}