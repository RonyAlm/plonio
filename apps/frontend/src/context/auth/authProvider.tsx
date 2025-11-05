import { useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import type { Credentials, User } from "../../utils/interface/user.interface";
import loginService from "../../services/authService";

export type Props = {
    children?: React.ReactNode
}
const AuthProvider = ({ children }: Props) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setToken(user.accessToken)
            setUser(user)
        }
    }, [])

    const login = async (user: Credentials) => {
        const { email, password } = user;

        const response = await loginService.login({ email, password })

        if (!response?.isSuccess) {
            setError(response?.error === "Invalid credentials" ? "Credenciales incorrectas" : response?.error)
            setTimeout(() => {
                setError(null)
            }, 5000)
            return { isSuccess: false, error: response?.error as string }
        }

        setUser(response.user)
        setToken(response.accessToken)
        window.localStorage.setItem('loggedUser', JSON.stringify(response.user))

        return response

    }

    const logout = () => {
        setUser(null);
        setToken(null);
        window.localStorage.removeItem('loggedUser')
    }

    const createAccount = async (user: User) => {

        const response = await loginService.createAccount(user)

        if (!response?.isSuccess) {
            setError(response?.error as string)
            setTimeout(() => {
                setError(null)
            }, 5000)
            return { isSuccess: false, error: response?.error as string }
        }

        return response

    }

    return (
        <AuthContext.Provider value={{ user, login, logout, error, createAccount, token }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider

