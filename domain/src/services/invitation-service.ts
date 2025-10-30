import { Invitation } from "../entities/invitation.js";

export interface InvitationService {
    findByUserId: (userId: string) => Promise<Invitation[] | null>
    findById: (invitationId: string) => Promise<Invitation | null>
    create: (project: Invitation) => Promise<Invitation | null>
    update: (project: Invitation) => Promise<Invitation | null>
    delete: (id: string) => Promise<object | null>
}