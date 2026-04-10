import { Body, Controller, Get, Post } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewDto } from './dto/create-new.dto';
import { Article } from '../article.entity';

@Controller('news')
export class NewsController {

    constructor (private readonly newsService: NewsService) {}

    @Post()
    createNew(@Body() createNewDto: CreateNewDto): Promise<Article> {
        return this.newsService.createNewsArticle(createNewDto);
    }

    @Get()
    findAllNews(): Promise<Article[]> {
        return this.newsService.findLastNewsArticle();
    }
}
