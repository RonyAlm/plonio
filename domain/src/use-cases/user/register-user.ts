import { User, UserSecure } from "../../entities/user.js";
import { PasswordService } from "../../services/password-service.js";
import { UserService } from "../../services/user-service.js";
import { isValidEmail, isValidName, isValidPassword } from "../../utils/validations.js";


export interface RegisterUserParams {
    dependencies: {
        userService: UserService;
        passwordService: PasswordService;
    };
    payload: User;
}

export type RegisterUserResult = Promise<{ isSuccess: true; data: UserSecure } | { isSuccess: false; error: string }>

export async function registerUser({ dependencies, payload }: RegisterUserParams): RegisterUserResult {

    const { userService } = dependencies;
    const { passwordService } = dependencies;

    if (!payload.email || !payload.password) return { isSuccess: false, error: "Email and password are required" };

    if(!isValidName(payload.name)) return { isSuccess: false, error: "Invalid name" };
    if(!isValidEmail(payload.email)) return { isSuccess: false, error: "Invalid email" };
    if(!isValidPassword(payload.password)) return { isSuccess: false, error: "Invalid password" };


    const existing = await userService.findByEmail(payload.email);
    if (existing) return { isSuccess: false, error: "Email already registered" };

    const hashedPassword = await passwordService.hash(payload.password);
    const newUser: User = {
        id: crypto.randomUUID(),
        name : payload.name,
        email : payload.email,
        password: hashedPassword,
        role: "USER",
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const savedUser = await userService.save(newUser);
    return { isSuccess: true, data: savedUser };

}