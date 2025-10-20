import { User } from "../../entities/user.js";
import { UserService, PasswordService, TokenService } from "../../services/user-service.js";

export interface LoginUserParams {
    dependencies: {
        userService: UserService,
        passwordService: PasswordService,
        tokenService: TokenService
    };
    payload: Pick<User, "email" | "password">;
}

export type LoginUserResult = Promise<{ isSuccess: boolean; user?: User; error?: string; accessToken?: string }>

export async function loginUser({ dependencies, payload }: LoginUserParams): LoginUserResult {
  
    const user = await dependencies.userService.findByEmail(payload.email);

    if (!user) {
        return { isSuccess: false, error: "Password or email invalid" };
    }

    const isValidPassword = await dependencies.passwordService.compare(payload.password, user.password);

    if (!isValidPassword) {
        return { isSuccess: false, error: "Password or email invalid" };
    }

    const accessToken = dependencies.tokenService.generateAccessToken({ userId: user.id, role: user.role });

    return { isSuccess: true,  user: user, accessToken };

}