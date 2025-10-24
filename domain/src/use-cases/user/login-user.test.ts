import { describe, test, expect } from "vitest";
import { MokedAuthService, MokedPasswordService, MokedUserService } from "../../services/mocks/mock-user-service.js";
import { loginUser } from "./login-user.js";

describe("LoginUser", async () => {

    const userService = MokedUserService();
    const passwordService = MokedPasswordService();
    const AuthService = MokedAuthService();;

    const dependencies = {
        userService,
        passwordService,
        authService: AuthService
    }

    test("should login a user successfully and return access token", async () => {
        const input = {
            email: "ema@ema.com",
            password: "ema123"
        }

        const result = await loginUser({
            dependencies,
            payload: input
        });

        expect(result.isSuccess).toBe(true);
        expect(result.isSuccess && result.data?.accessToken).toBeDefined();
    });

    test("should return error if email is format invalid", async () => {
        const input = {
            email: "emaema.com",
            password: "ema123"
        }

        const result = await loginUser({
            dependencies,
            payload: input
        });

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Invalid email");
    });

    test("should return error credentials if email or password is invalid", async () => {
        const input = {
            email: "ema@ema.com",
            password: "emae433"
        }

        const result = await loginUser({
            dependencies,
            payload: input
        });

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Invalid credentials");
    });

    test("should return error if email or password is empty", async () => {
        const input = {
            email: "",
            password: ""
        }

        const result = await loginUser({
            dependencies,
            payload: input
        });

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Credentials are required");
    });

});