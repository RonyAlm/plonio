import { User } from "../../entities/user.js"
import { PasswordService, TokenService, UserService } from "../../services/user-service.js"

interface UpdateUserProfileParams {
    dependencies: {
        userService: UserService
        passwordService: PasswordService
        tokenService: TokenService
    }
    payload: {
        token: string
        idUser: string
        input: Partial<User>
    }
}

type UserSecure = Omit<User, "password">

type UpdateUserProfileResult = Promise<{ isSuccess: boolean, user?: UserSecure, error?: string }>

export async function updateUserProfile({ dependencies, payload }: UpdateUserProfileParams): UpdateUserProfileResult {

    const existingUser = await dependencies.userService.findById(payload.idUser);

    if (!existingUser) {
        return { isSuccess: false, error: "User not found" };
    }

    const userToken = await dependencies.tokenService.verifyAccessToken(payload.token);
    if (!userToken) return { isSuccess: false, error: "Invalid token" };

    let password = existingUser.password;
    let email = existingUser.email;

    if (payload.input.password) {
        const hashedPassword = await dependencies.passwordService.hash(payload.input.password);
        password = hashedPassword;
    }

    if (payload.input.email ) {
        const existingEmail = await dependencies.userService.findByEmail(payload.input.email);

        if (existingEmail) {
            return { isSuccess: false, error: "Email already exists" };
        }

        email = payload.input.email;
    }

    const userUpdated = {
        ...existingUser,
        ...payload.input,
        email,
        password
    }

    const user = await dependencies.userService.update(userUpdated);

    if (!user) {
        return { isSuccess: false, error: "Error updating user" };
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