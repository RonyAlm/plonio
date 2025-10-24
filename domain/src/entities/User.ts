export const UserRole = {
    ADMIN: 'ADMIN',
    USER: 'USER',
    EDITOR: 'EDITOR',
    MANAGER: 'MANAGER',
    VIEWER: 'VIEWER'
} as const

export type UserRole = typeof UserRole[keyof typeof UserRole]

export interface User {
    id?: string;
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    createdAt?: Date;
    updatedAt?: Date;
}

export type UserSecure = Omit<User, 'password'>
