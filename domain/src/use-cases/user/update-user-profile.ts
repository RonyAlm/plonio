import { User, UserSecure } from "../../entities/user.js"
import { PasswordService } from "../../services/password-service.js"
import { UserService } from "../../services/user-service.js"
import { isValidEmail, isValidName, isValidPassword } from "../../utils/validations.js"

interface UpdateUserProfileParams {
    dependencies: {
        userService: UserService
        passwordService: PasswordService
    }
    payload: {
        userId: string
        input: Partial<User>
    }
}

type UpdateUserProfileResult = Promise<{ isSuccess: boolean, data?: UserSecure, error?: string }>

export async function updateUserProfile({ dependencies, payload }: UpdateUserProfileParams): UpdateUserProfileResult {

    const { passwordService, userService } = dependencies;
    const { input, userId } = payload;

    if (!userId) {
        return { isSuccess: false, error: "Missing credentials" };
    }

    const existingUser = await userService.findById(userId);

    if (!existingUser) {
        return { isSuccess: false, error: "Missing credentials" };
    }
    
    let newName = existingUser.name;
    let newPassword = existingUser.password;
    let newEmail = existingUser.email;

    if (input.name && !isValidName(input.name)) return { isSuccess: false, error: "Invalid name" };
    if (input.name) newName = input.name;
    
    if(input.password && !isValidPassword(input.password)) return { isSuccess: false, error: "Invalid password" };
    if(input.password) newPassword = await passwordService.hash(input.password);

    if (input.email && !isValidEmail(input.email)) return { isSuccess: false, error: "Invalid email" };
    if (input.email) {
        const existingEmail = await userService.findByEmail(input.email);
        if (existingEmail) return { isSuccess: false, error: "Email already exists" };
        newEmail = input.email;
    }

    if(input.role) return { isSuccess: false, error: "Role cannot be updated" };

    const newUser = {
        ...existingUser,
        ...input,
        password: newPassword,
        email: newEmail
    }

    const userUpdated = await dependencies.userService.update(newUser);

    if (!userUpdated) return { isSuccess: false, error: "Error updating user" };
    
    const userResponse: UserSecure = {
        ...userUpdated,
        updatedAt: new Date()
    };

    return { isSuccess: true, data: userResponse };
}