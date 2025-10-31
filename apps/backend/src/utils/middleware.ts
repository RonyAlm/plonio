import { Request, Response, NextFunction } from "express"
import { AuthServiceJwt } from "../services/auth-service-jwt.js";

declare module "express-serve-static-core" {
    interface Request {
        token?: string
        user?: any
    }
}

export const tokenExtractor = (request: Request, response: Response, next: NextFunction) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7)
    }
    next()
}

export const userExtractor = (request: Request, response: Response, next: NextFunction) => {
    const authService = new AuthServiceJwt()
    request.user = request.token ? authService.verifyToken(request.token) : null
    next()
}

export const unknownEndpoint = (req: Request, res: Response) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    console.error(error.message)
    if (error.message === 'User not found') {
        return res.status(400).send({ isSuccess: false, error: 'Usuario no encontrado' })
    } else if (error.message === 'Missing Credentials') {
        return res.status(400).send({ isSuccess: false, error: 'Usuario o contraseña incorrectos' })
    } else if (error.message === 'Invalid Credentials') {
        return res.status(400).send({ isSuccess: false, error: 'Usuario o contraseña incorrectos' })
    } else if (error.message === 'Project not found') {
        return res.status(400).send({ isSuccess: false, error: 'Proyecto no encontrado' })
    } else {
        return res.status(500).send({ isSuccess: false, error: error.message })
    }
}

