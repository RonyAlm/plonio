export const MemberRole = {
    VIEWER: 'VIEWER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN', 
    MANAGER: 'MANAGER',
    USER: 'USER'
} as const

export type MemberRole = typeof MemberRole[keyof typeof MemberRole]

export interface Member {
    id: string
    userId: string
    projectId: string
    role: MemberRole
    createdAt: Date
    updatedAt: Date
}