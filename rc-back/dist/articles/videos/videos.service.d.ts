import { CreateVideoDto } from './dto/create-video.dto';
import { ArticlesService } from '../articles.service';
import { Article } from '../article.entity';
export declare class VideosService {
    private readonly articlesService;
    constructor(articlesService: ArticlesService);
    createVideoArticle(data: CreateVideoDto): Promise<Article>;
    findLastVideosArticle(): Promise<Article[]>;
}
