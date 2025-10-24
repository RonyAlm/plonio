import { test, expect, describe } from "vitest";
import { MokedUserService } from "../../services/mocks/mock-user-service.js";
import { revokeRole } from "./revoke-role.js";

describe("RevokeRole", async () => {

    const userService = MokedUserService();
    const dependencies = {
        userService
    }

    test("should assign role to user successfully", async () => {

        const result = await revokeRole({
            dependencies: dependencies,
            payload: { adminId: 'admin-2', targetUserId: "user-1" }
        });

        expect(result.isSuccess).toBe(true);
        expect(result.isSuccess && result.data).toBeDefined();
        expect(result.isSuccess && result.data && result.data.id).toBe("user-1");
        expect(result.isSuccess && result.data && result.data.role).toBe("USER");

    });

    test("should return error if target user not found", async () => {

        const result = await revokeRole({
            dependencies: dependencies,
            payload: { adminId: "admin-2", targetUserId: "user-not-found" }
        });

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Target user not found");
    });

    test("should return error if adminId is empty or not exists", async () => {

        const result = await revokeRole({
            dependencies: dependencies,
            payload: { adminId: "", targetUserId: "1324" }
        });

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Missing credentials");

    });

    test("should return error if adminId is not ADMIN or MANAGER", async () => {

        const result = await revokeRole({
            dependencies: dependencies,
            payload: { adminId: "user-1", targetUserId: "admin-2" }
        });

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Only admin and manager can revoke roles");

    });

    test("should return role default USER if revoke role is success", async () => {

        const result = await revokeRole({
            dependencies: dependencies,
            payload: { adminId: "admin-2", targetUserId: "user-1" }
        });

        expect(result.isSuccess).toBe(true);
        expect(result.isSuccess && result.data).toBeDefined();
        expect(result.isSuccess && result.data && result.data.id).toBe("user-1");
        expect(result.isSuccess && result.data && result.data.role).toBe("USER");

    });

});