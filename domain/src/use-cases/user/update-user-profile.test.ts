import { test, expect, describe, beforeAll } from "vitest";
import { updateUserProfile } from "./update-user-profile.js";
import { MokedPasswordService, MokedTokenService, MokedUserService } from "../../services/mocks/mock-user-service.js";
import { loginUser } from "./login-user.js";

describe("UpdateUserProfile", async () => {
    let token: string;

    beforeAll(async () => {
        const userService = MokedUserService();
        const passwordService = MokedPasswordService();
        const tokenService = MokedTokenService();

        const login = await loginUser({
            dependencies: {
                userService: userService,
                passwordService: passwordService,
                tokenService: tokenService
            },
            payload: {
                email: "ronaldo@ronaldo.com",
                password: "ronaldo123"
            }
        });

        if (login.isSuccess && login.accessToken) {
            token = login.accessToken;
        }
    })

    test("should update user profile", async () => {
        const userService = MokedUserService();
        const passwordService = MokedPasswordService();
        const tokenService = MokedTokenService();

        const result = await updateUserProfile(
            {
                dependencies:
                    { userService, passwordService, tokenService },
                payload: {
                    token: token,
                    idUser: "1324",
                    input: {
                        name: "Rony Almiron",
                        email: "rony@rony.com",
                    }
                }
            });

        expect(result.isSuccess).toBe(true);
        expect(result.isSuccess && result.user).toBeDefined();
    });

    test("should return error if user not found", async () => {
        const userService = MokedUserService();
        const passwordService = MokedPasswordService();
        const tokenService = MokedTokenService()

        const result = await updateUserProfile({
            dependencies: 
            { userService, passwordService, tokenService }, 
            payload: {
                token: token,
                idUser: "user-not-found",
                input: {
                    name: "Rony Almiron",
                    email: "rony@rony.com",
                }
            }
        });

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("User not found");
    });

    test("should return error if email exists", async () => {
        const userService = MokedUserService();
        const passwordService = MokedPasswordService();
        const tokenService = MokedTokenService()

        const result = await updateUserProfile({
            dependencies: { 
                userService, passwordService, tokenService
             }, payload: {
                token: token,
                idUser: "1324",
                input: {
                    name: "Rony Almiron",
                    email: "ema@ema.com",
                }
            }
        });

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Email already exists");
    });

});