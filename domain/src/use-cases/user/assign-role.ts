import { UserRole, UserSecure } from "../../entities/user.js"
import { UserService } from "../../services/user-service.js"

export interface AssignRoleParams {
    dependencies: {
        userService: UserService
    }
    payload: {
        adminId: string;
        targetUserId: string;
        role: UserRole;
    }
}

type AssignRoleResult = Promise<{ isSuccess: boolean, data?: Partial<UserSecure>, error?: string }>

export async function assignRole({ dependencies, payload }: AssignRoleParams): AssignRoleResult {

    const { userService } = dependencies;
    const { adminId, targetUserId, role } = payload;

    const adminUser = await userService.findById(adminId.trim());
    if (!adminUser) return { isSuccess: false, error: "Missing credentials" };

    if (adminUser.role !== 'ADMIN' && adminUser.role !== 'MANAGER') {
        return { isSuccess: false, error: "Only admin and manager can assign roles" };
    }

    if(role !== 'USER' && role !== 'ADMIN' && role !== 'MANAGER' && role !== 'EDITOR' && role !== 'VIEWER') {
        return { isSuccess: false, error: "Role is required or not exists" };
    }

    const targetUser = await userService.findById(targetUserId);
    if (!targetUser) return { isSuccess: false, error: "Target user not found" };
    if(targetUser.id === adminId) return { isSuccess: false, error: "You cannot change your own role" };
    
    const updated = await userService.updateRole(targetUserId, role);
    if (!updated) return { isSuccess: false, error: "Error assigning role" };

     const updatedUser = {
        id: updated.id as string,
        name: updated.name,
        email: updated.email,
        role: updated.role as UserRole
    }

    return { isSuccess: true, data: updatedUser };
}