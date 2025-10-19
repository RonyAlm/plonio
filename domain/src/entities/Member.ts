export const MemberRole = {
    VIEWER: 'viewer',
    EDITOR: 'editor'
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