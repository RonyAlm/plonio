import { createContext } from "react";
import type { Credentials, ResponseApi, User } from "../../utils/interface/user.interface";

interface AuthContextType {
    user: User | null;
    login: (credentials: Credentials) => Promise<ResponseApi>;
    logout: () => void
    createAccount: (user: User) => Promise<ResponseApi>;
    error: string | null
    token: string | null
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);