import { describe, test, expect } from "vitest";
import { MokedPasswordService, MokedTokenService, MokedUserService } from "../../services/mocks/mock-user-service.js";
import { loginUser } from "./login-user.js";

describe("LoginUser", async () => {

    test("should login a user successfully and return access token", async () => {
        const input = {
            email: "ema@ema.com",
            password: "ema123"
        }

        const userService = MokedUserService();
        const passwordService = MokedPasswordService();
        const tokenService = MokedTokenService();

        const result = await loginUser({
            dependencies: { userService, passwordService, tokenService },
            payload: input
        });

        expect(result.isSuccess).toBe(true);
        expect(result.isSuccess && result.accessToken).toBeDefined();
    });

    test("should return error if email is invalid", async () => {
        const input = {
            email: "otro@otro.com",
            password: "password123"
        }

        const userService = MokedUserService();
        const passwordService = MokedPasswordService();
        const tokenService = MokedTokenService();


        const result = await loginUser({
            dependencies: { userService, passwordService, tokenService },
            payload: input
        });

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Password or email invalid");
    });

    test("should return error if password is invalid", async () => {

        const input = {
            email: "ema@ema.com",
            password: "rony123"
        }

        const userService = MokedUserService();
        const passwordService = MokedPasswordService();
        const tokenService = MokedTokenService();

        const resultLogin = await loginUser({
            dependencies: { userService, passwordService, tokenService },
            payload: input
        });

        expect(resultLogin.isSuccess).toBe(false);
        expect(resultLogin.error).toBe("Password or email invalid");
    });

});