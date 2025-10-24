import { User } from "../../entities/user.js";
import { UserService } from "../../services/user-service.js";

export interface GetUserParams {
    dependencies: {
        userService: UserService,
    }
    payload: {
        id?: string
    };
}

type UserPublic = Omit<User, "password" | "createdAt" | "updatedAt">

export type GetUserResult = Promise<{ isSuccess: boolean, error?: string, data?: UserPublic | UserPublic[] }>;

export async function getUser({ dependencies, payload }: GetUserParams): GetUserResult {

    const { userService } = dependencies;

    let result: UserPublic[] | UserPublic = [];

    if (!payload.id) {
        const users = await userService.getAll();
        result = users.map(({...rest }) => rest);
        return { isSuccess: true, data: result };
    };

    if (payload.id) {
        const user = await userService.findById(payload.id);
        if (!user) return { isSuccess: false, error: "User not found" };
        const {...publicUser } = user;
        result = publicUser;
        return { isSuccess: true, data: result };
    };

    return { isSuccess: true, data: result };
}