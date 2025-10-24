import { test, expect, describe } from "vitest";
import { updateUserProfile } from "./update-user-profile.js";
import { MokedPasswordService, MokedUserService } from "../../services/mocks/mock-user-service.js";

describe("UpdateUserProfile", async () => {

    const userService = MokedUserService();
    const passwordService = MokedPasswordService();
    const dependencies = { userService, passwordService };

    test("should update user profile", async () => {

        const result = await updateUserProfile(
            {
                dependencies: dependencies,
                payload: {
                    userId: "admin-2",
                    input: {
                        name: "Ronaldo Ema Almiron"
                    }
                }
            });

        expect(result.isSuccess).toBe(true);
        expect(result.isSuccess && result.data).toBeDefined();
    });

    test("should return error if userId is empty", async () => {

        const result = await updateUserProfile({
            dependencies: dependencies,
            payload: {
                userId: "",
                input: {
                    name: "Rony Almiron",
                    email: "ema@ema.com",
                }
            }
        });

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Missing credentials");
    });

    test("should return error if user not found", async () => {

        const result = await updateUserProfile({
            dependencies: dependencies,
            payload: {
                userId: "user-not-found",
                input: {
                    name: "Rony Almiron",
                    email: "ema@ema.com",
                }
            }
        });

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Missing credentials");
    });

    test("should return error if email exists", async () => {

        const result = await updateUserProfile({
            dependencies: dependencies,
            payload: {
                userId: "user-1",
                input: {
                    email: "ema@ema.com",
                }
            }
        });

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Email already exists");
    });

    test("should return error if email is invalid", async () => {

        const result = await updateUserProfile({
            dependencies: dependencies,
            payload: {
                userId: "user-1",
                input: {
                    email: "emaema.com",
                }
            }
        });

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Invalid email");
    });

    test("should return error if password is invalid", async () => {

        const result = await updateUserProfile({
            dependencies: dependencies,
            payload: {
                userId: "user-1",
                input: {
                    password: "ema",
                }
            }
        });

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Invalid password");
    });

    test("should return error if name is invalid", async () => {

        const result = await updateUserProfile({
            dependencies: dependencies,
            payload: {
                userId: "user-1",
                input: {
                    name: " ",
                }
            }
        });

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Invalid name");
    });

    test("should return error if role cannot be updated", async () => {

        const result = await updateUserProfile({
            dependencies: dependencies,
            payload: {
                userId: "user-1",
                input: {
                    role: "MANAGER",
                }
            }
        });

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Role cannot be updated");
    });

});