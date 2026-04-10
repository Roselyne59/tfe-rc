import { CreateArticleDto } from 'src/articles/dto/create-article.dto';
declare class MetadataDto {
    videoLink: string;
    picturesList: string[];
}
export declare class CreateVideoDto extends CreateArticleDto {
    metadata: MetadataDto;
}
export {};
