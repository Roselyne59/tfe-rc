import { VideosService } from './videos.service';
import { Article } from '../article.entity';
import { CreateVideoDto } from './dto/create-video.dto';
export declare class VideosController {
    private readonly videosService;
    constructor(videosService: VideosService);
    createVideo(createVideoDto: CreateVideoDto): Promise<Article>;
    findAllVideos(): Promise<Article[]>;
}
