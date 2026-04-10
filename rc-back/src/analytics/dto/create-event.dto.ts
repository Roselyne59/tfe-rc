import {
  IsEnum,
  IsUUID,
  IsInt,
  IsOptional,
  IsObject,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EventType } from '../enum/EventType.enum';

export class CreateEventDto {
  @IsEnum(EventType)
  eventType: EventType;

  @IsInt()
  articleId: number;

  @IsUUID()
  anonymousId: string;

  @IsOptional()
  @IsInt()
  duration?: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class CreateEventBatchDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEventDto)
  events: CreateEventDto[];
}
