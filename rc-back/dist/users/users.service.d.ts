import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    findAll(): Promise<Omit<User, 'password'>[]>;
    findByEmail(email: string): Promise<User | null>;
    count(): Promise<number>;
}
