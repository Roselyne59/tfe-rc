import { Body, Controller, Get, Post } from '@nestjs/common';
import { VideosService } from './videos.service';
import { Article } from '../article.entity';
import { CreateVideoDto } from './dto/create-video.dto';

@Controller('videos')
export class VideosController {

    constructor(private readonly videosService: VideosService) {}

    @Post()
    createVideo(@Body() createVideoDto: CreateVideoDto): Promise<Article> {
        return this.videosService.createVideoArticle(createVideoDto);
    }

    @Get()
    findAllVideos(): Promise<Article[]> {
        return this.videosService.findLastVideosArticle();
    }

}
