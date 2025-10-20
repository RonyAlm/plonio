import { User } from "../entities/user.js";

export interface UserService {
    save: (user: User) => Promise<User>
    findByEmail: (email: string) => Promise<User | null>
}

export interface PasswordService {
    hash: (password: string) => Promise<string>;
    compare: (password: string, hashedPassword: string) => Promise<boolean>;
}

export interface TokenService {
    generateAccessToken: (payload: object) => string;
    generateRefreshToken: (payload: object) => string;
    verifyAccessToken: (token: string) => Promise<User | null>;
    verifyRefreshToken: (token: string) => Promise<User | null>;
}