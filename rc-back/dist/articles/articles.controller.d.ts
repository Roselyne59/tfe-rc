import { ArticlesService } from './articles.service';
import { Article } from './article.entity';
export declare class ArticlesController {
    private readonly articlesService;
    constructor(articlesService: ArticlesService);
    findLastForEachType(): Promise<Article[]>;
    findAll(): Promise<Article[]>;
    findOne(id: string): Promise<Article>;
    update(id: string, body: Partial<Article>): Promise<Article>;
    delete(id: string): Promise<void>;
}
