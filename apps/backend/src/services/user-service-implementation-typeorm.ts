import { DataSource } from 'typeorm'

import UserEntity from '../entities/user.entity.js'
import { User, UserService } from '../../../../domain/dist/index.js'

export class UserServiceImplementationTypeorm implements UserService {

    constructor(
        private readonly dataSource: DataSource
    ) { }

    async findByEmail(email: string): Promise<User | null> {
        const repo = this.dataSource.getRepository<any>(UserEntity as any);

        return await repo.findOne({ where: { email } });

    }

    async save(user: User): Promise<User> {
        //     const repo = this.dataSource.getRepository<any>(ProvisionEntity as any);

        // const found = await repo.findOne({ where: { id } });

        const repo = this.dataSource.getRepository(UserEntity);

        return await repo.save(user)

    }
}