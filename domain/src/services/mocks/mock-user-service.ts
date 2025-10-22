import { User } from "../../entities/user.js";
import { UserService } from "../user-service.js";
import { PasswordService } from "../password-service.js";
import { AuthService } from "../auth-service.js";

const idGenerator = () => crypto.randomUUID();


export function MokedUserService(): UserService {
    const users: User[] = [{
        id: 'user-1',
        name: "Ema Paz",
        email: "ema@ema.com",
        password: "hashed_ema123",
        role: "USER",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 'admin-2',
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
            const id = user.id ?? idGenerator();
            const role = user.role ?? "USER";
            const createdAt = user.createdAt ?? new Date();
            const updatedAt = new Date();

            user.id = id;
            user.role = role;
            user.createdAt = createdAt;
            user.updatedAt = updatedAt;

            users.push(user);

            return {
                id,
                name: user.name,
                email: user.email,
                role,
                createdAt,
                updatedAt
            };
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

export function MokedAuthService(): AuthService {
    return {
        async generateTokens(userId) {
            return {
                accessToken: `accessToken_${userId}`,
                refreshToken: `refreshToken_${userId}`
            };
        },
        async verifyToken(token) {
            return {
                userId: `userId_${token}`
            };
        }
    }
}
