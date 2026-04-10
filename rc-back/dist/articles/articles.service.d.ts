import { Article } from './article.entity';
import { Repository } from 'typeorm';
import { ArticleType } from './enum/ArticleType.enum';
export declare class ArticlesService {
    private readonly articleRepository;
    constructor(articleRepository: Repository<Article>);
    creeateBaseArticle(data: {
        userId?: number;
        title: string;
        content: string;
        type: ArticleType;
        isActive: boolean;
        metadata?: Record<string, any>;
    }): Promise<Article>;
    findAll(): Promise<Article[]>;
    findAllByType(type: ArticleType): Promise<Article[]>;
    findOne(id: number): Promise<Article>;
    findLastForEachType(): Promise<Article[]>;
    update(id: number, data: Partial<Article>): Promise<Article>;
    delete(id: number): Promise<void>;
    count(): Promise<number>;
}
