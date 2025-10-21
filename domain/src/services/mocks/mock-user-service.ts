import { User } from "../../entities/user.js";
import { PasswordService, TokenService, UserService } from "../user-service.js";

const idGenerator = () => crypto.randomUUID();


export function MokedUserService(): UserService {
    const users: User[] = [{
        id: '1324',
        name: "Ema Paz",
        email: "ema@ema.com",
        password: "hashed_ema123",
        role: "USER",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: '1325',
        name: "Ronaldo Almiron",
        email: "ronaldo@ronaldo.com",
        password: "hashed_ronaldo123",
        role: "ADMIN",
        createdAt: new Date(),
        updatedAt: new Date()
    }


    ];

    return {
        async save(user) {
            users.push(user);
            return user;
        },
        async findById(id) {
            return users.find((user) => user.id === id) || null;
        },
        async findByEmail(email) {
            return users.find((user) => user.email === email) || null;
        },
        async update(userData) {
            const index = users.findIndex((user) => user.id === userData.id);
            if (index === -1) return null;
            users[index] = userData;
            return userData;
        },
        async updateRole(idUser, role = "USER") {
            const index = users.findIndex((user) => user.id === idUser);
            const user = users[index];
            if (!user) return null;
            user.role = role;
            return user;
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
