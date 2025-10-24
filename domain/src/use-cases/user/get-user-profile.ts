import { UserSecure } from "../../entities/user.js";
import { UserService } from "../../services/user-service.js";

export interface GetUserProfileParams {
    dependencies: {
        userService: UserService
    }
    payload: {
        userId: string
    }
}

export type GetUserProfileResult = Promise<{ isSuccess: boolean, error?: string, data?: UserSecure }>;

export async function getUserProfile({ dependencies, payload }: GetUserProfileParams): GetUserProfileResult {

    const { userId } = payload;
    const { userService } = dependencies;

    if (!userId) return { isSuccess: false, error: "Missing credentials" };

    const user = await userService.findById(userId);

    if (!user) return { isSuccess: false, error: "Missing credentials" };

    const userResponse: UserSecure = {
        id: user.id || userId,
        name: user.name,
        email: user.email,
        role: user.role || "USER",
        createdAt: user.createdAt || new Date(),
        updatedAt: user.updatedAt || new Date()
    };

    return {
        isSuccess: true,
        data: {
            ...userResponse
        }
    };
}