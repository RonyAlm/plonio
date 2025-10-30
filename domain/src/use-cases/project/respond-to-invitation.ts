import { InvitationStatus } from "../../entities/invitation.js";
import { Member } from "../../entities/member.js";
import { Project } from "../../entities/project.js";
import { UserRole } from "../../entities/user.js";
import { InvitationService } from "../../services/invitation-service.js";
import { MemberService } from "../../services/member-service.js";
import { ProjectService } from "../../services/project-service.js"
export interface RespondToInvitationParams {
    dependencies: {
        projectService: ProjectService,
        invitationService: InvitationService,
        memberService: MemberService
    },
    payload: {
        invitationId: string;
        userId: string;
        response: InvitationStatus
    }
}

type RespondToInvitationResult = Promise<{
    isSuccess: boolean,
    message?: string,
    project?: Partial<Project>,
    error?: string
}>

export async function respondToInvitation({ dependencies, payload }: RespondToInvitationParams): RespondToInvitationResult {

    const { projectService, invitationService, memberService } = dependencies;
    const { invitationId, userId, response } = payload;

    if (!userId) return { isSuccess: false, error: "Missing credentials" };
    if (!invitationId) return { isSuccess: false, error: "Invitation id is required" };

    const invitation = await invitationService.findById(invitationId);
    if (!invitation) return { isSuccess: false, error: "Invitation not found" };

    if (response !== InvitationStatus.ACCEPTED && response !== InvitationStatus.REJECTED) return { isSuccess: false, error: "Status not found" };

    if (response === InvitationStatus.REJECTED) {
        await invitationService.update({ ...invitation, status: response });
        return {
            isSuccess: true,
            message: "Invitation rejected",
        }
    }

    const project = await projectService.findById(invitation.projectId);
    if (!project) return { isSuccess: false, error: "Project not found" };

    const addedMember = await memberService.addMember({
        id: crypto.randomUUID() as string,
        projectId: invitation.projectId,
        userId: userId,
        role: invitation.role as UserRole,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    await invitationService.update({ ...invitation, status: response });

    const projectUpdated = await projectService.findById(addedMember.projectId);
    const member = await memberService.findByUserAndProject(userId, addedMember.projectId);

    return {
        isSuccess: true,
        message: "Invitation accepted",
        project: {
            ...projectUpdated,
            members: [...projectUpdated?.members || [], member as Member]
        }
    }

}