
import jwt from 'jsonwebtoken'

import { TokenService, User } from '../../../../domain/dist/index.js'

export class TokenServiceImplementation implements TokenService {
    constructor() { }

    generateAccessToken(payload: object): string {
        return jwt.sign(payload, 'secret', { expiresIn: '4h' });
    }

    generateRefreshToken(payload: object): string {
        return jwt.sign(payload, 'secret', { expiresIn: '7d' });
    }

    verifyAccessToken(token: string): Promise<User | null> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, 'secret', (err, decoded) => {
                if (err) {
                    resolve(null);
                } else {
                    resolve(decoded as User);
                }
            });
        });
    }
    
    verifyRefreshToken(token: string): Promise<User | null> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, 'secret', (err, decoded) => {
                if (err) {
                    resolve(null);
                } else {
                    resolve(decoded as User);
                }
            });
        });
    }

}