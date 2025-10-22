import { User, UserRole, UserSecure } from "../../entities/user.js"
import { UserService } from "../../services/user-service.js"

export interface AssignRoleParams {
    dependencies: {
        userService: UserService
    }
    payload: {
        idUserOwner: string,
        idUser: string
        role: UserRole
    }
}

type AssignRoleResult = Promise<{ isSuccess: boolean, data?: Partial<UserSecure>, error?: string }>

export async function assignRole({ dependencies, payload }: AssignRoleParams): AssignRoleResult {

    const { userService } = dependencies;
    const { idUser, role, idUserOwner } = payload;

    const rolUserOwner = await userService.findById(idUserOwner.trim());
    if (!rolUserOwner) return { isSuccess: false, error: "User owner id is required" };

    if (rolUserOwner.role !== 'ADMIN' && rolUserOwner.role !== 'MANAGER') {
        return { isSuccess: false, error: "Only admin and manager can assign roles" };
    }

    const user = await userService.findById(idUser);
    if (!user) return { isSuccess: false, error: "User not found" };

    const updated = await userService.updateRole(idUser, role);
    if (!updated) return { isSuccess: false, error: "User not found after role update" };
    return { isSuccess: true, data: updated };
}