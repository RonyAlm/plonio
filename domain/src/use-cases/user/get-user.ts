import { User, UserRole } from "../../entities/user.js";
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
        result = users.map(({ id, name, email, role }) => ({
            id: id as string,
            name,
            email,
            role: role as UserRole
        }));
        return { isSuccess: true, data: result };
    };

    if (payload.id) {
        const user = await userService.findById(payload.id);
        if (!user) return { isSuccess: false, error: "User not found" };
        const { id, name, email, role } = user;
        return { isSuccess: true, data: {
            id: id as string ,
            name,
            email,
            role: role as UserRole
        } };
    };

    return { isSuccess: true, data: result };
}