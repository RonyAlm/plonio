
import bcrypt from 'bcrypt'
import { PasswordService} from '../../../../domain/dist/index.js'

export class PasswordServiceBcrypt implements PasswordService {
    constructor() { }

    async hash(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    async compare(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }
}