import { Article } from '../articles/article.entity';
export declare class User {
    id: number;
    username: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    articles: Article[];
    createdAt: Date;
    updatedAt: Date;
}
