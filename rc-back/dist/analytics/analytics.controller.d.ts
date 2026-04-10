import { AnalyticsService } from './analytics.service';
import { CreateEventBatchDto } from './dto/create-event.dto';
import { AnalyticsEvent } from './analytics.entity';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    createEvents(body: CreateEventBatchDto): Promise<AnalyticsEvent[]>;
    getArticleStats(id: string): Promise<{
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
    getTrends(period: string): Promise<{
        date: string;
        views: number;
        interactions: number;
    }[]>;
    getRankings(sortBy: string, limit: string): Promise<{
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
}
