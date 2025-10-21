import { test, expect, describe } from "vitest";
import { updateUserProfile } from "./update-user-profile.js";
import { MokedPasswordService, MokedUserService } from "../../services/mocks/mock-user-service.js";

describe("UpdateUserProfile", async () => {
    test("should update user profile", async () => {
        const userService = MokedUserService();
        const passwordService = MokedPasswordService();

        const result = await updateUserProfile({ dependencies: { userService, passwordService }, payload: {
            idUser: "1324",
            input: {
                name: "Rony Almiron",
                email: "rony@rony.com",
            }
        } });

        expect(result.isSuccess).toBe(true);
        expect(result.isSuccess && result.user).toBeDefined();
    });

    test("should return error if user not found", async () => {
        const userService = MokedUserService();
        const passwordService = MokedPasswordService();

        const result = await updateUserProfile({ dependencies: { userService, passwordService }, payload: {
            idUser: "user-not-found",
            input: {
                name: "Rony Almiron",
                email: "rony@rony.com",
            }
        } });

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("User not found");
    });

    test("should return error if email exists", async () => {
        const userService = MokedUserService();
        const passwordService = MokedPasswordService();

        const result = await updateUserProfile({ dependencies: { userService, passwordService }, payload: {
            idUser: "1324",
            input: {
                name: "Rony Almiron",
                email: "ema@ema.com",
            }
        } });

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Email already exists");
    });

});