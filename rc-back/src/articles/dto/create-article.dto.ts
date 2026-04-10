import { ArticleType } from '../enum/ArticleType.enum'; 
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateArticleDto {
    
    @IsOptional()
    @IsInt()
    userId?: number;

    @IsString()
    title: string;

    @IsString()
    content: string;
    
    @IsEnum(ArticleType)
    type: ArticleType;
    
    @IsBoolean()
    isActive: boolean;
}