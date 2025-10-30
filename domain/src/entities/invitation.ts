import { UserRole } from "./user.js"

export const InvitationStatus = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected'
} as const

export type InvitationStatus = typeof InvitationStatus[keyof typeof InvitationStatus]

export interface Invitation {
    id: string
    projectId: string
    invitedUserId: string
    invitedBy: string
    role?: UserRole
    status: InvitationStatus
    createdAt: Date
    updatedAt: Date
}