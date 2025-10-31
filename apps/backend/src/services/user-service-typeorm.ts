import { UserEntity } from '../models/typeorm/user.entity.js'
import { User, UserRole, UserSecure, UserService } from '../../../../domain/dist/index.js'
import { AppDataSource } from '../utils/conexionDB.js';

export class UserServiceTypeorm implements UserService {

    async findByEmail(email: string): Promise<User | null> {
        const data = await AppDataSource.getRepository(UserEntity).findOne({ where: { email: email } });
        return data
    }

    async findById(id: string): Promise<User | null> {
        const data = await AppDataSource.getRepository(UserEntity).findOne({ where: { id: id } });
        return data
    }

    async getAll(): Promise<UserSecure[]> {
        const data = await AppDataSource.getRepository(UserEntity).find({ select: ['id', 'name', 'email', 'role'] });
        return data
    }

    async save(user: User): Promise<User> {
        const savedUser = await AppDataSource.getRepository(UserEntity).save(user);
        return savedUser
    }

    async update(user: Partial<User>): Promise<User> {
        if (!user.id) throw new Error('User id is required');
        const data = await AppDataSource.getRepository(UserEntity).update(user.id as any, user);
        if (!data) throw new Error('Error updating user');
        const updated = await AppDataSource.getRepository(UserEntity).findOne({ where: { id: user.id } });
        if (!updated) throw new Error('User not found after update');
        return updated
    }

    async updateRole(idUser: string, role: UserRole): Promise<User> {
        const data = await AppDataSource.getRepository(UserEntity).update(idUser as any, { role });
        if (!data) throw new Error('Error updating user role');
        const updated = await AppDataSource.getRepository(UserEntity).findOne({ where: { id: idUser } });
        if (!updated) throw new Error('User not found after update');
        return updated
    }
}