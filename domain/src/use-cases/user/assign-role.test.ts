import { test, expect, describe, beforeAll } from "vitest";
import { assignRole } from "./assign-role.js";
import { MokedPasswordService, MokedTokenService, MokedUserService } from "../../services/mocks/mock-user-service.js";
import { loginUser } from "./login-user.js";

describe("AssignRole", async () => {
    let tokenAdminRole: string;
    let tokenUserRole: string;

    beforeAll(async () => {
        const userService = MokedUserService();
        const passwordService = MokedPasswordService();
        const tokenService = MokedTokenService();

        const loginAdminRole = await loginUser({
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

        if (loginAdminRole.isSuccess && loginAdminRole.accessToken) {
            tokenAdminRole = loginAdminRole.accessToken;
        }

        const loginUserRole = await loginUser({
            dependencies: {
                userService: userService,
                passwordService: passwordService,
                tokenService: tokenService
            },
            payload: {
                email: "ema@ema.com",
                password: "ema123"
            }
        });

        if (loginUserRole.isSuccess && loginUserRole.accessToken) {
            tokenUserRole = loginUserRole.accessToken;
        }

    });

    test("should assign role to user successfully", async () => {
        const userService = MokedUserService();
        const tokenService = MokedTokenService();

        const result = await assignRole({
            dependencies: { userService, tokenService },
            payload: { token: tokenAdminRole, idUser: "1324", role: "EDITOR" }
        });

        expect(result.isSuccess).toBe(true);
        expect(result.user).toBeDefined();
        expect(result.user && result.user.role).toBe("EDITOR");

    });

    test("should return error if user not found", async () => {
        const userService = MokedUserService();
        const tokenService = MokedTokenService();

        const result = await assignRole({
            dependencies: { userService, tokenService },
            payload: { token: tokenAdminRole, idUser: "user-not-found", role: "ADMIN" }
        });

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("User not found");
    });

    test("should return an error if the user does not have the ADMIN role", async () => {
        const userService = MokedUserService();
        const tokenService = MokedTokenService();

        const result = await assignRole({
            dependencies: { userService, tokenService },
            payload: { token: tokenUserRole, idUser: "1324", role: "USER" }
        });

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("User does not have the ADMIN role");
    });
});