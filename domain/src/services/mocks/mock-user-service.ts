import { User } from "../../entities/user.js";
import { PasswordService, TokenService, UserService } from "../user-service.js";


export function MokedUserService(): UserService{
    const users: User[] = [{
        id: crypto.randomUUID(),
        name: "Ema Paz",
        email: "ema@ema.com",
        password: "hashed_ema123",
        role: "USER",
        createdAt: new Date(),
        updatedAt: new Date()
    }];

    return {
        async save(user) {
            users.push(user);
            return user;
        },
        async findByEmail(email) {
            return users.find((user) => user.email === email) || null;
        }
    };
};

export function MokedPasswordService(): PasswordService {
    return {
        async hash(password) {
            return `hashed_${password}`;
        },
        async compare(password, hashed) {
            return hashed === `hashed_${password}`;
        }
    }
};

export function MokedTokenService(): TokenService {
    return {
        generateAccessToken(payload) {
            return `token_${JSON.stringify(payload)}`;
        },
        generateRefreshToken(payload) {
            return `refresh_${JSON.stringify(payload)}`;
        },
        verifyAccessToken(token) {
            return token.startsWith("token_") ? JSON.parse(token.slice(6)) : null;
        },
        verifyRefreshToken(token) {
            return token.startsWith("refresh_") ? JSON.parse(token.slice(8)) : null;
        },
    }
}
