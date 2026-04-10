import { NewsService } from './news.service';
import { CreateNewDto } from './dto/create-new.dto';
import { Article } from '../article.entity';
export declare class NewsController {
    private readonly newsService;
    constructor(newsService: NewsService);
    createNew(createNewDto: CreateNewDto): Promise<Article>;
    findAllNews(): Promise<Article[]>;
}
