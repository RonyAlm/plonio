import { User, UserRole } from "../../entities/user.js"
import { TokenService, UserService } from "../../services/user-service.js"

export interface AssignRoleParams {
    dependencies: {
        userService: UserService,
        tokenService: TokenService
    }
    payload: {
        token: string
        idUser: string
        role: UserRole
    }
}

type UserSecure = Omit<User, 'password'>

type AssignRoleResult = Promise<{ isSuccess: boolean, user?: UserSecure, error?: string }>

export async function assignRole({ dependencies, payload }: AssignRoleParams) : AssignRoleResult {
   
    const existingUser = await dependencies.userService.findById(payload.idUser);

    if (!existingUser) {
        return { isSuccess: false, error: "User not found" };
    }

    const userToken = await dependencies.tokenService.verifyAccessToken(payload.token);
    if (!userToken) return { isSuccess: false, error: "Invalid token" };

    if (userToken.role !== 'ADMIN') {
        return { isSuccess: false, error: "User does not have the ADMIN role" };
    }

    const user = await dependencies.userService.updateRole(payload.idUser, payload.role);

    if (!user) {
        return { isSuccess: false, error: "Error updating user role" };
    }

    const userResponse: UserSecure = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || "USER",
        createdAt: user.createdAt || new Date(),
        updatedAt: user.updatedAt || new Date()
    };

    return { isSuccess: true, user: userResponse };
}