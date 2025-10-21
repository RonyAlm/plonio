import { User } from "../../entities/user.js";
import {  UserService } from "../../services/user-service.js";

export interface GetUserParams {
    dependencies: {
        userService: UserService,
    }
    payload: {
        idUser: string
    };
}

type UserSecure = Omit<User, "password">

export type GetUserResult = Promise<{ isSuccess: boolean, error?: string, user?: UserSecure }>;

export async function getUser({ dependencies, payload }: GetUserParams): GetUserResult {

    const user = await dependencies.userService.findById(payload.idUser);

    if (!user) return { isSuccess: false, error: "User not found" };

    const userResponse: UserSecure = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || "USER",
    };

    return {
        isSuccess: true,
        user: userResponse
    };
}