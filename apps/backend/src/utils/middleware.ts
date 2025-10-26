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

