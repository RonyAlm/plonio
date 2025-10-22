import { test, expect, describe, beforeAll } from "vitest";
import { assignRole } from "./assign-role.js";
import { MokedUserService } from "../../services/mocks/mock-user-service.js";

describe("AssignRole", async () => {

    const userService = MokedUserService();

    test("should assign role to user successfully", async () => {

        const result = await assignRole({
            dependencies: { userService },
            payload: { idUserOwner: 'admin-2', idUser: "user-1", role: "USER" }
        });

        expect(result.isSuccess).toBe(true);
        expect(result.isSuccess && result.data).toBeDefined();
        expect(result.isSuccess && result.data && result.data.id).toBe("user-1");
        expect(result.isSuccess && result.data && result.data.role).toBe("USER");

    });

    test("should return error if user not found", async () => {

        const result = await assignRole({
            dependencies: { userService },
            payload: { idUserOwner: "admin-2", idUser: "user-not-found", role: "MANAGER" }
        });

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("User not found");
    });

    test("should return error if idUserOwner is empty", async () => {

        const result = await assignRole({
            dependencies: { userService },
            payload: { idUserOwner: "", idUser: "1324", role: "MANAGER" }
        });

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("User owner id is required");
        
    });

    test("should return error if not owner ADMIN or MANAGER", async () => {

        const result = await assignRole({
            dependencies: { userService },
            payload: { idUserOwner: "user-1", idUser: "admin-2", role: "MANAGER" }
        });

        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe("Only admin and manager can assign roles");

    });
});