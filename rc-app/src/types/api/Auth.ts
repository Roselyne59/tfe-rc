import { RoleType, User } from "./User";

export interface LoginDto {
    username?: string;
    email?: string;
    password: string;
}

export interface LoginResponse {
    statusCode: number;
    message: string;
    // Structure attendue (idéale)
    data?: {
        user: User;
        access_token: string;
    };
    // Structure réelle de votre serveur
    accessToken?: string;
}

export interface RegisterDto {
    username: string;
    password: string;
    email: string;
    role?: RoleType;
}

export interface RegisterResponse {
    statusCode: number;
    message: string;
    data: User;
}