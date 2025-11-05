export interface User {
    id?: string;
    name: string;
    email: string;
    password?: string;
    role?: string;
}

export interface Credentials {
    email: string;
    password: string
}

export interface ResponseApi {
    isSuccess: boolean
    error?: string
    data?: User
    user?: User
    accessToken?: string
    refreshToken?: string
}