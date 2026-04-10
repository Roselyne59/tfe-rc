import { Repository } from 'typeorm';
import { AnalyticsEvent } from './analytics.entity';
import { CreateEventDto } from './dto/create-event.dto';
export declare class AnalyticsService {
    private readonly analyticsRepository;
    private readonly RETENTION_DAYS;
    constructor(analyticsRepository: Repository<AnalyticsEvent>);
    createEvent(dto: CreateEventDto): Promise<AnalyticsEvent>;
    createEventBatch(dtos: CreateEventDto[]): Promise<AnalyticsEvent[]>;
    getArticleStats(articleId: number): Promise<{
        totalViews: number;
        averageReadTime: number;
        totalShares: number;
        totalFavorites: number;
    }>;
    getSummary(): Promise<{
        totalEvents: number;
        mostViewedArticles: {
            articleId: number;
            viewCount: number;
        }[];
        averageReadTimeGlobal: number;
    }>;
    getTrends(period: 'day' | 'week'): Promise<{
        date: string;
        views: number;
        interactions: number;
    }[]>;
    getRankings(sortBy: 'views' | 'readTime' | 'shares' | 'favorites', limit?: number): Promise<{
        articleId: number;
        title: string;
        type: string;
        views: number;
        averageReadTime: number;
        shares: number;
        favorites: number;
    }[]>;
    getContentTypeStats(): Promise<{
        news: {
            views: number;
            averageReadTime: number;
            shares: number;
            favorites: number;
        };
        videos: {
            views: number;
            averageReadTime: number;
            shares: number;
            favorites: number;
        };
    }>;
    cleanupExpiredEvents(): Promise<number>;
}
