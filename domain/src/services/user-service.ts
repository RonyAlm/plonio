import { User, UserRole, UserSecure } from "../entities/user.js";

export interface UserService {
    save: (user: User) => Promise<UserSecure>
    findById: (id: string) => Promise<User | null>
    findByEmail: (email: string) => Promise<User | null>
    update: ( user: User) => Promise<User | null>
    updateRole: ( idUser: string, role: UserRole) => Promise<User | null>
}