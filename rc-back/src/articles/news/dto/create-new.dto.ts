import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateArticleDto } from 'src/articles/dto/create-article.dto';

class MetadataDto {
  @IsArray()
  @IsString({ each: true })
  picturesList: string[];
}

export class CreateNewDto extends CreateArticleDto {

  constructor() {
    super();
    this.metadata = { picturesList: [] };
  }

  @ValidateNested()
  @Type(() => MetadataDto)
  metadata: MetadataDto;
}
