import { User } from "../../entities/user.js";
import { UserService, PasswordService, TokenService } from "../../services/user-service.js";

export interface RegisterUserParams {
    dependencies: {
        userService: UserService,
        passwordService: PasswordService
    };
    payload: User;
}

export type RegisterUserResult = Promise<{ isSuccess: true; user: User } | { isSuccess: false; error: string }>

export async function registerUser({ dependencies, payload }: RegisterUserParams): RegisterUserResult {

    const existingUser = await dependencies.userService.findByEmail(payload.email);

    if (existingUser) {
        return { isSuccess: false, error: "Email already exists" };
    }

    const hashedPassword = await dependencies.passwordService.hash(payload.password);

    const user = await dependencies.userService.save({ ...payload, password: hashedPassword });

    return { isSuccess: true, user };

}