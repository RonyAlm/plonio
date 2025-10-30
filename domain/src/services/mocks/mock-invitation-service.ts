import { InvitationService } from "../invitation-service.js";
import { Invitation } from "../../entities/invitation.js";

export function MokedInvitationService(): InvitationService {
    const invitations: Invitation[] = []

    return {
        async create(invitation) {
            invitations.push(invitation);
            return invitation || null;
        },
        async findById(invitationId) {
            return invitations.find((invitation) => (invitation.id === invitationId)) || null;
        },
        async findByUserId(userId) {
            return invitations.filter((invitation) => (invitation.invitedUserId === userId)) || null;
        },
        async update(invitation) {
            const index = invitations.findIndex(inv => inv.id === invitation.id);
            if (index === -1) return null;
            invitations[index] = invitation;
            return invitation;
        },
        async delete(id) {
            const index = invitations.findIndex((invitation) => invitation.id === id);
            if (index === -1) return null;
            invitations.splice(index, 1);
            return { id };
        }
    };
};

