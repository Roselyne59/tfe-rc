import { EventType } from '../enum/EventType.enum';
export declare class CreateEventDto {
    eventType: EventType;
    articleId: number;
    anonymousId: string;
    duration?: number;
    metadata?: Record<string, any>;
}
export declare class CreateEventBatchDto {
    events: CreateEventDto[];
}
