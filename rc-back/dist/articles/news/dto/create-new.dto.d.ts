import { CreateArticleDto } from 'src/articles/dto/create-article.dto';
declare class MetadataDto {
    picturesList: string[];
}
export declare class CreateNewDto extends CreateArticleDto {
    constructor();
    metadata: MetadataDto;
}
export {};
