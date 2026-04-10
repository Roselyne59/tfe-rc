import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateArticleDto } from 'src/articles/dto/create-article.dto';

class MetadataDto {
  @IsString()
  videoLink: string;

  @IsArray()
  picturesList: string[];
}

export class CreateVideoDto extends CreateArticleDto {

  @ValidateNested()
  @Type(() => MetadataDto)
  metadata: MetadataDto;
}
