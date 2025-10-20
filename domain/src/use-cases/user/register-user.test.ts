import { describe, expect, test } from 'vitest';
import { registerUser } from './register-user.js';
import { User } from '../../entities/user.js';
import { MokedPasswordService, MokedUserService } from '../../services/mocks/mock-user-service.js';

describe('RegisterUser', async () => {

    test('should register a user successfully', async () => {

        const input: User = {
            id: crypto.randomUUID(),
            name: 'Rony Almiron',
            email: 'rony@rony.com',
            password: 'password123',
            role: 'USER',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const userService = MokedUserService();
        const passwordService = MokedPasswordService();

        const result = await registerUser(
            {
                dependencies: { userService, passwordService },
                payload: input
            });

        expect(result.isSuccess).toBe(true);
        expect(result.isSuccess && result).toStrictEqual({
            isSuccess: true,
            user: {
                id: input.id,
                name: input.name,
                email: input.email,
                password: expect.any(String),
                role: input.role,
                createdAt: input.createdAt,
                updatedAt: input.updatedAt
            }
        });
    })

    test('should throw error if user already exists', async () => {

        const input: User = {
            id: crypto.randomUUID(),
            name: 'User User',
            email: 'user@user.com',
            password: 'password123',
            role: 'USER',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const userService = MokedUserService();
        const passwordService = MokedPasswordService();

        await registerUser({ dependencies: { userService, passwordService }, payload: input });

        const result = await registerUser({ dependencies: { userService, passwordService }, payload: input });

        expect(result.isSuccess).toBe(false);
        expect(result).toStrictEqual({
            isSuccess: false,
            error: "Email already exists"
        });
    })

    test('should hash password before saving', async () => {

        const input: User = {
            id: crypto.randomUUID(),
            name: 'Rony Almiron',
            email: 'rony@rony.com',
            password: 'password123',
            role: 'USER',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const userService = MokedUserService();
        const passwordService = MokedPasswordService();

        const result = await registerUser(
            {
                dependencies: { userService, passwordService },
                payload: input
            });

        expect(result.isSuccess).toBe(true);
        expect(result.isSuccess && result.user.password).not.toBe(input.password);
    });

})