import { Article } from '../articles/article.entity';
import { EventType } from './enum/EventType.enum';
export declare class AnalyticsEvent {
    id: number;
    eventType: EventType;
    article: Article;
    articleId: number;
    anonymousId: string;
    duration: number;
    metadata: Record<string, any>;
    createdAt: Date;
    expiresAt: Date;
}
