import { describe, expect, test } from 'vitest';
import { registerUser } from './register-user.js';
import { User } from '../../entities/user.js';
import { MokedPasswordService, MokedUserService } from '../../services/mocks/mock-user-service.js';

describe('RegisterUser', async () => {

    const userService = MokedUserService();
    const passwordService = MokedPasswordService();
    const dependencies = { userService, passwordService };

    test.only('should register a user successfully', async () => {

        const input: User = {
            name: 'Rony Almiron',
            email: 'rony@rony.com',
            password: 'password123',
            role: 'USER'
        };

        const result = await registerUser(
            {
                dependencies: dependencies,
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

    test.only('should return error if email or password is empty', async () => {

        const result = await registerUser(
            {
                dependencies: dependencies,
                payload: {
                    name: 'Rony Almiron',
                    email: '',
                    password: '',
                    role: 'USER'
                }
            });

        expect(result.isSuccess).toBe(false);
        expect(result).toStrictEqual({
            isSuccess: false,
            error: "Email and password are required"
        });
    })

    test.only('should return error if name is invalid', async () => {

        const result = await registerUser(
            {
                dependencies: dependencies,
                payload: {
                    name: '',
                    email: 'ema@ema.com',
                    password: 'password123',
                    role: 'USER'
                }
            });

        expect(result.isSuccess).toBe(false);
        expect(result).toStrictEqual({
            isSuccess: false,
            error: "Invalid name"
        });
    })

    test.only('should return error if email is invalid', async () => {

        const result = await registerUser(
            {
                dependencies: dependencies,
                payload: {
                    name: 'Rony Almiron',
                    email: 'emaema.com',
                    password: 'password123',
                    role: 'USER'
                }
            });

        expect(result.isSuccess).toBe(false);
        expect(result).toStrictEqual({
            isSuccess: false,
            error: "Invalid email"
        });
    })

    test.only('should return error if password is invalid', async () => {

        const result = await registerUser(
            {
                dependencies: dependencies,
                payload: {
                    name: 'Rony Almiron',
                    email: 'ema@ema.com',
                    password: 'ema',
                    role: 'USER'
                }
            });

        expect(result.isSuccess).toBe(false);
        expect(result).toStrictEqual({
            isSuccess: false,
            error: "Invalid password"
        });
    })

    test.only('should return error if user already exists', async () => {

        const input: User = {
            name: 'User User',
            email: 'ronaldo@ronaldo.com',
            password: 'password123'
        };

        const userService = MokedUserService();
        const passwordService = MokedPasswordService();

        await registerUser({ dependencies: dependencies, payload: input });

        const result = await registerUser({ dependencies: { userService, passwordService }, payload: input });

        expect(result.isSuccess).toBe(false);
        expect(result).toStrictEqual({
            isSuccess: false,
            error: "Email already registered"
        });
    })
    
})