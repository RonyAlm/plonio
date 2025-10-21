import { User } from "../../entities/user.js";
import { TokenService, UserService } from "../../services/user-service.js";

export interface GetUserProfileParams {
    dependencies: {
        userService: UserService,
        tokenService: TokenService
    }
    payload: {
        token: string
    };
}

type UserSecure = Omit<User, "password">

export type GetUserProfileResult = Promise<{ isSuccess: boolean, error?: string, user?: UserSecure }>;

export async function getUserProfile({ dependencies, payload }: GetUserProfileParams): GetUserProfileResult {

    const userToken = await dependencies.tokenService.verifyAccessToken(payload.token);
    if (!userToken) return { isSuccess: false, error: "Invalid token" };

    const user = await dependencies.userService.findByEmail(userToken.email);

    if (!user) return { isSuccess: false, error: "User not found" };

    const userResponse: UserSecure = {
        id: user.id || crypto.randomUUID(),
        name: user.name,
        email: user.email,
        role: user.role || "USER",
        createdAt: user.createdAt || new Date(),
        updatedAt: user.updatedAt || new Date()
    };

    return {
        isSuccess: true,
        user: userResponse
    };
}