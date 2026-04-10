import { Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { ArticlesService } from '../articles.service';
import { Article } from '../article.entity';
import { ArticleType } from '../enum/ArticleType.enum';

@Injectable()
export class VideosService {

    constructor(private readonly articlesService: ArticlesService) {}

    createVideoArticle(data: CreateVideoDto): Promise<Article> {
        return this.articlesService.creeateBaseArticle({
            userId: data.userId, // Optional user ID
            title: data.title,
            content: data.content,
            type: ArticleType.VIDEOS, // Assuming you have an enum for ArticleType
            isActive: data.isActive,
            metadata: {
                picturesList: data.metadata.picturesList,
                videoLink: data.metadata.videoLink, // Assuming videoLink is part of the metadata
            }
        });
    }

    findLastVideosArticle(): Promise<Article[]> {
        return this.articlesService.findAllByType(ArticleType.VIDEOS); // Assuming 'videos' is a valid ArticleType
    }
}
