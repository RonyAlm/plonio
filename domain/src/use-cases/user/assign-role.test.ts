import { test, expect, describe} from "vitest";
import { assignRole } from "./assign-role.js";
import { MokedUserService } from "../../services/mocks/mock-user-service.js";
import { UserRole } from "../../entities/user.js";

describe("AssignRole", async () => {

    const userService = MokedUserService();
    const dependencies = {
        userService
    }

    test("should assign role to user successfully", async () => {

        const result = await assignRole({
            dependencies: dependencies,
            payload: { adminId: 'admin-2', targetUserId: "user-1", role: "VIEWER" }
        });

        expect(result.isSuccess).toBe(true);
        expect(result.isSuccess && result.data).toBeDefined();
        expect(result.isSuccess && result.data && result.data.id).toBe("user-1");
        expect(result.isSuccess && result.data && result.data.role).toBe("VIEWER");

    });

    test("should return error if target user not found", async () => {

        const result = await assignRole({
            dependencies: dependencies,
            payload: { adminId: "admin-2", targetUserId: "user-not-found", role: "MANAGER" }
        });

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Target user not found");
    });

    test("should return error if adminId is empty or not exists", async () => {

        const result = await assignRole({
            dependencies: dependencies,
            payload: { adminId: "", targetUserId: "1324", role: "MANAGER" }
        });

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Missing credentials");
        
    });

    test("should return error if adminId is not ADMIN or MANAGER", async () => {

        const result = await assignRole({
            dependencies: dependencies,
            payload: { adminId: "user-1", targetUserId: "admin-2", role: "MANAGER" }
        });

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Only admin and manager can assign roles");

    });

    test("should return error if role is empty or not exists", async () => {

        const result = await assignRole({
            dependencies: dependencies,
            payload: { adminId: "admin-2", targetUserId: "user-1", role: "OTROROL" as UserRole }
        });

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Role is required");
    });

    test("should return error if a user tries to change their own role (promote or demote)", async () => {

        const result = await assignRole({
            dependencies: dependencies,
            payload: { adminId: "admin-2", targetUserId: "admin-2", role: "MANAGER" }
        });

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("You cannot change your own role");
    });
});