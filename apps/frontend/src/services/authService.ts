import { AxiosError } from 'axios'
import type { User } from '../utils/interface/user.interface'
import { api } from '../utils/axiosClient'

const login = async (credentials: { email: string, password: string }) => {
    try {
        const response = await api.post('/api/login', credentials)
        return response.data
    } catch (error) {
        const err = error as AxiosError<{ error: string }>
        return { isSuccess: false, error: err.response?.data.error || err.message }
    }
}

const createAccount = async (user: User) => {
    try {
        const response = await api.post('/api/register', user)
        return response.data
    } catch (error) {
        const err = error as AxiosError<{ error: string }>
        return { isSuccess: false, error: err.response?.data.error || err.message }
    }
}

export default { login, createAccount }