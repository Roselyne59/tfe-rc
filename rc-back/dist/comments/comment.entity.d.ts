import { Article } from '../articles/article.entity';
export declare class Comment {
    id: number;
    author: string;
    content: string;
    article: Article;
    articleId: number;
    createdAt: Date;
}
