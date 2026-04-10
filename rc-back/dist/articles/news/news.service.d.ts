import { CreateNewDto } from './dto/create-new.dto';
import { ArticlesService } from '../articles.service';
import { Article } from '../article.entity';
export declare class NewsService {
    private readonly articlesService;
    constructor(articlesService: ArticlesService);
    createNewsArticle(data: CreateNewDto): Promise<Article>;
    findLastNewsArticle(): Promise<Article[]>;
}
