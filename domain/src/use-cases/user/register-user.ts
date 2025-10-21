import { User } from "../../entities/user.js";
import { UserService, PasswordService, TokenService } from "../../services/user-service.js";

export interface RegisterUserParams {
    dependencies: {
        userService: UserService,
        passwordService: PasswordService
    };
    payload: User;
}

type UserSecure = Omit<User, "password">

export type RegisterUserResult = Promise<{ isSuccess: true; user: UserSecure } | { isSuccess: false; error: string }>

export async function registerUser({ dependencies, payload }: RegisterUserParams): RegisterUserResult {

    const existingUser = await dependencies.userService.findByEmail(payload.email);

    if (existingUser) {
        return { isSuccess: false, error: "Email already exists" };
    }

    const hashedPassword = await dependencies.passwordService.hash(payload.password);

    const user = await dependencies.userService.save({ ...payload, password: hashedPassword });

    if (!user) {
        return { isSuccess: false, error: "Error creating user" };
    }

    const userResponse: UserSecure = {
        id: user.id || crypto.randomUUID(),
        name: user.name,
        email: user.email,
        role: user.role || "USER",
        createdAt: user.createdAt || new Date(),
        updatedAt: user.updatedAt || new Date()
    };

    return { isSuccess: true, user: userResponse };

}