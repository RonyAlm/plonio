import { DataSource } from 'typeorm'

import UserEntity from '../models/typeorm/user.entity.js'
import { User, UserRole, UserSecure, UserService } from '../../../../domain/dist/index.js'

export class UserServiceTypeorm implements UserService {

    constructor(
        private readonly dataSource: DataSource
    ) { }
    

    async findByEmail(email: string): Promise<User | null> {
        const repo = this.dataSource.getRepository<any>(UserEntity as any);

        return await repo.findOne({ where: { email } });

    }

    async findById(id : string): Promise<User | null> {
        const repo = this.dataSource.getRepository<any>(UserEntity as any);

        return await repo.findOne({ where: { id: id   } });
    }

    async getAll(): Promise<UserSecure[]> {
        const repo = this.dataSource.getRepository<any>(UserEntity as any);
        return await repo.find();
    }

    async save(user: User): Promise<User> {
        const repo = this.dataSource.getRepository(UserEntity);
        return await repo.save(user)
    }

    async update(user: Partial<User>): Promise<User> {
        if (!user.id) throw new Error('User id is required to update');
        const repo = this.dataSource.getRepository(UserEntity);
        await repo.update(user.id as any, user);
        const updated = await repo.findOne({ where: { id: user.id } });
        if (!updated) throw new Error('User not found after update');
        return updated as User;
    }

    async updateRole(idUser: string, role: UserRole): Promise<User> {
        const repo = this.dataSource.getRepository(UserEntity);
        await repo.update(idUser as any, { role });
        const updated = await repo.findOne({ where: { id: idUser } });
        if (!updated) throw new Error('User not found after role update');
        return updated as User;
    }
}