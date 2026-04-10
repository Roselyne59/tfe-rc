import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<User>;
    login(user: User): Promise<{
        access_token: string;
    }>;
    register(dto: {
        username: string;
        email: string;
        password: string;
    }): Promise<User>;
}
