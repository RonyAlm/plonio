import { UserRole, UserSecure } from "../../entities/user.js"
import { UserService } from "../../services/user-service.js"

export interface RevokeRoleParams {
    dependencies: {
        userService: UserService
    }
    payload: {
        adminId: string;
        targetUserId: string;
    }
}

type RevokeRoleResult = Promise<{ isSuccess: boolean, data?: Partial<UserSecure>, error?: string }>

export async function revokeRole({ dependencies, payload }: RevokeRoleParams): RevokeRoleResult {

    const { userService } = dependencies;
    const { adminId, targetUserId } = payload;

    const adminUser = await userService.findById(adminId.trim());
    if (!adminUser) return { isSuccess: false, error: "Missing credentials" };

    if (adminUser.role !== 'ADMIN' && adminUser.role !== 'MANAGER') {
        return { isSuccess: false, error: "Only admin and manager can revoke roles" };
    }

    const targetUser = await userService.findById(targetUserId.trim());
    if (!targetUser) return { isSuccess: false, error: "Target user not found" };

    const updated = await userService.updateRole(targetUserId, 'USER');
    if (!updated) return { isSuccess: false, error: "Error revoking role" };

    const updatedUser = {
        id: updated.id as string,
        name: updated.name,
        email: updated.email,
        role: updated.role as UserRole
    }

    return { isSuccess: true, data: updatedUser };
}