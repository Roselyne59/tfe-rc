import { ArticleType } from '../enum/ArticleType.enum';
export declare class CreateArticleDto {
    userId?: number;
    title: string;
    content: string;
    type: ArticleType;
    isActive: boolean;
}
