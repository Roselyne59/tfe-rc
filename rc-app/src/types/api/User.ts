export type RoleType = "user" | "admin";

export interface User {
    id: string;
    username: string;
    email: string;
    role: RoleType;
    createdAt: string;
    updatedAt: string;
    }

    export interface UserRef {
    id: string;
    username: string;
    }

    export interface CreateUserDTO {
    username: string;
    password: string;
    email: string;
    role?: RoleType;
}