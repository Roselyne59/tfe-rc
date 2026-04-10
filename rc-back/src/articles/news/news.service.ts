import { Injectable } from '@nestjs/common';
import { CreateNewDto } from './dto/create-new.dto';
import { ArticlesService } from '../articles.service';
import { Article } from '../article.entity';
import { ArticleType } from '../enum/ArticleType.enum'; // Assuming you have an enum for ArticleType

@Injectable()
export class NewsService {

    constructor(private readonly articlesService: ArticlesService) {}

    createNewsArticle(data: CreateNewDto): Promise<Article> {
        return this.articlesService.creeateBaseArticle({
            userId: data.userId, // Optional user ID
            title: data.title,
            content: data.content,
            type: data.type, // Assuming you have an enum for ArticleType
            isActive: data.isActive,
            metadata : {
                picturesList: data.metadata.picturesList,
            }
        });
    }

    findLastNewsArticle(): Promise<Article[]> {
        return this.articlesService.findAllByType(ArticleType.NEWS); // Assuming 'news' is a valid ArticleType
    }
}
