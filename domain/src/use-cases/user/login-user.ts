import { User, UserSecure } from "../../entities/user.js";
import { UserService } from "../../services/user-service.js";
import { PasswordService } from "../../services/password-service.js";
import { AuthService } from "../../services/auth-service.js";

export interface LoginUserParams {
    dependencies: {
        userService: UserService,
        passwordService: PasswordService,
        authService: AuthService
    };
    payload: Pick<User, "email" | "password">;
}

export type LoginUserResult = Promise<{ isSuccess: boolean; data?: { user: UserSecure; accessToken: string; refreshToken: string }; error?: string }>

export async function loginUser({ dependencies, payload }: LoginUserParams): LoginUserResult {

    const { userService, passwordService, authService } = dependencies;

    if (!payload.email || !payload.password) {
        return { isSuccess: false, error: "Missing credentials" };
    }

    if (!payload.email.includes("@")) {
        return { isSuccess: false, error: "Invalid email" };
    }

    const user = await userService.findByEmail(payload.email);

    if (!user || !user.id) {
        return { isSuccess: false, error: "User not found" };
    }

    const isValid = await passwordService.compare(payload.password, user.password);
    if (!isValid) return { isSuccess: false, error: "Invalid password" };

    const tokens = await authService.generateTokens(user.id);
    return { isSuccess: true, data: { user, ...tokens } };

}