import { describe, expect, test } from 'vitest';
import { registerUser } from './register-user.js';
import { User } from '../../entities/user.js';
import { MokedPasswordService, MokedUserService } from '../../services/mocks/mock-user-service.js';

describe('RegisterUser', async () => {

    const userService = MokedUserService();
    const passwordService = MokedPasswordService();

    test('should register a user successfully', async () => {

        const input: User = {
            name: 'Rony Almiron',
            email: 'rony@rony.com',
            password: 'password123',
            role: 'USER'
        };

        const result = await registerUser(
            {
                dependencies: { userService, passwordService },
                payload: input
            });

        expect(result.isSuccess).toBe(true);
        expect(result.isSuccess && result).toEqual({
            isSuccess: true,
            data: {
                id: expect.any(String),
                name: input.name,
                email: input.email,
                role: input.role,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date)
            }
        });
    })

    test('should return error if missing credentials', async () => {

        const result = await registerUser(
            {
                dependencies: { userService, passwordService },
                payload: {
                    name: 'Rony Almiron',
                }
            });

        expect(result.isSuccess).toBe(false);
        expect(result).toStrictEqual({
            isSuccess: false,
            error: "Missing credentials"
        });
    })

    test('should return error if user already exists', async () => {

        const input: User = {
            id: crypto.randomUUID(),
            name: 'User User',
            email: 'rony@rony.com',
            password: 'password123',
            role: 'USER',
        };

        const userService = MokedUserService();
        const passwordService = MokedPasswordService();

        await registerUser({ dependencies: { userService, passwordService }, payload: input });

        const result = await registerUser({ dependencies: { userService, passwordService }, payload: input });

        expect(result.isSuccess).toBe(false);
        expect(result).toStrictEqual({
            isSuccess: false,
            error: "Email already registered"
        });
    })

    test('should hash password before saving', async () => {

        const input: User = {
            name: 'Alvaro Almiron',
            email: 'alvaro@alvaro.com',
            password: 'password123',
            role: 'USER'
        };

        const result = await registerUser(
            {
                dependencies: { userService, passwordService },
                payload: input
            });

        expect(result.isSuccess).toBe(true);
        expect(result.isSuccess && result).toEqual({
            isSuccess: true,
            data: {
                id: expect.any(String),
                name: input.name,
                email: input.email,
                role: input.role,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date)
            }
        });

    });

})