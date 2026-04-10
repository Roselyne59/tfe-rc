import { User } from '../users/user.entity';
import { Comment } from '../comments/comment.entity';
import { ArticleType } from '../articles/enum/ArticleType.enum';
export declare class Article {
    id: number;
    user: User;
    comments: Comment[];
    title: string;
    content: string;
    type: ArticleType;
    isActive: boolean;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
