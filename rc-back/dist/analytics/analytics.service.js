"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const analytics_entity_1 = require("./analytics.entity");
let AnalyticsService = class AnalyticsService {
    analyticsRepository;
    RETENTION_DAYS = 90;
    constructor(analyticsRepository) {
        this.analyticsRepository = analyticsRepository;
    }
    async createEvent(dto) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + this.RETENTION_DAYS);
        const event = this.analyticsRepository.create({
            ...dto,
            expiresAt,
        });
        return this.analyticsRepository.save(event);
    }
    async createEventBatch(dtos) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + this.RETENTION_DAYS);
        const events = dtos.map((dto) => this.analyticsRepository.create({
            ...dto,
            expiresAt,
        }));
        return this.analyticsRepository.save(events);
    }
    async getArticleStats(articleId) {
        const stats = await this.analyticsRepository
            .createQueryBuilder('event')
            .select([
            "COUNT(CASE WHEN event.eventType IN ('article_view', 'video_view') THEN 1 END) AS \"totalViews\"",
            "COALESCE(AVG(CASE WHEN event.eventType IN ('article_read_time', 'video_read_time') THEN event.duration END), 0) AS \"averageReadTime\"",
            "COUNT(CASE WHEN event.eventType = 'article_share' THEN 1 END) AS \"totalShares\"",
            "COUNT(CASE WHEN event.eventType = 'article_favorite' THEN 1 END) AS \"totalFavorites\"",
        ])
            .where('event.articleId = :articleId', { articleId })
            .getRawOne();
        return {
            totalViews: parseInt(stats.totalViews, 10) || 0,
            averageReadTime: parseFloat(stats.averageReadTime) || 0,
            totalShares: parseInt(stats.totalShares, 10) || 0,
            totalFavorites: parseInt(stats.totalFavorites, 10) || 0,
        };
    }
    async getSummary() {
        const totalEvents = await this.analyticsRepository.count();
        const mostViewedArticles = await this.analyticsRepository
            .createQueryBuilder('event')
            .select('event.articleId', 'articleId')
            .addSelect('COUNT(*)', 'viewCount')
            .where("event.eventType IN ('article_view', 'video_view')")
            .groupBy('event.articleId')
            .orderBy('"viewCount"', 'DESC')
            .limit(10)
            .getRawMany();
        const avgResult = await this.analyticsRepository
            .createQueryBuilder('event')
            .select('COALESCE(AVG(event.duration), 0)', 'averageReadTime')
            .where("event.eventType IN ('article_read_time', 'video_read_time')")
            .getRawOne();
        return {
            totalEvents,
            mostViewedArticles: mostViewedArticles.map((row) => ({
                articleId: parseInt(row.articleId, 10),
                viewCount: parseInt(row.viewCount, 10),
            })),
            averageReadTimeGlobal: parseFloat(avgResult.averageReadTime) || 0,
        };
    }
    async getTrends(period) {
        const truncFn = period === 'day' ? 'day' : 'week';
        const rows = await this.analyticsRepository
            .createQueryBuilder('event')
            .select(`DATE_TRUNC('${truncFn}', event.createdAt)`, 'date')
            .addSelect("COUNT(CASE WHEN event.eventType IN ('article_view', 'video_view') THEN 1 END)", 'views')
            .addSelect("COUNT(CASE WHEN event.eventType NOT IN ('article_view', 'video_view') THEN 1 END)", 'interactions')
            .groupBy(`DATE_TRUNC('${truncFn}', event.createdAt)`)
            .orderBy('date', 'ASC')
            .getRawMany();
        return rows.map((row) => ({
            date: row.date,
            views: parseInt(row.views, 10) || 0,
            interactions: parseInt(row.interactions, 10) || 0,
        }));
    }
    async getRankings(sortBy, limit = 10) {
        const orderColumn = {
            views: 'views',
            readTime: 'averageReadTime',
            shares: 'shares',
            favorites: 'favorites',
        }[sortBy];
        const rows = await this.analyticsRepository
            .createQueryBuilder('event')
            .innerJoin('event.article', 'article')
            .select('event.articleId', 'articleId')
            .addSelect('article.title', 'title')
            .addSelect('article.type', 'type')
            .addSelect("COUNT(CASE WHEN event.eventType IN ('article_view', 'video_view') THEN 1 END)", 'views')
            .addSelect("COALESCE(AVG(CASE WHEN event.eventType IN ('article_read_time', 'video_read_time') THEN event.duration END), 0)", 'averageReadTime')
            .addSelect("COUNT(CASE WHEN event.eventType = 'article_share' THEN 1 END)", 'shares')
            .addSelect("COUNT(CASE WHEN event.eventType = 'article_favorite' THEN 1 END)", 'favorites')
            .groupBy('event.articleId')
            .addGroupBy('article.title')
            .addGroupBy('article.type')
            .orderBy(`"${orderColumn}"`, 'DESC')
            .limit(limit)
            .getRawMany();
        return rows.map((row) => ({
            articleId: parseInt(row.articleId, 10),
            title: row.title,
            type: row.type,
            views: parseInt(row.views, 10) || 0,
            averageReadTime: parseFloat(row.averageReadTime) || 0,
            shares: parseInt(row.shares, 10) || 0,
            favorites: parseInt(row.favorites, 10) || 0,
        }));
    }
    async getContentTypeStats() {
        const rows = await this.analyticsRepository
            .createQueryBuilder('event')
            .innerJoin('event.article', 'article')
            .select('article.type', 'contentType')
            .addSelect("COUNT(CASE WHEN event.eventType IN ('article_view', 'video_view') THEN 1 END)", 'views')
            .addSelect("COALESCE(AVG(CASE WHEN event.eventType IN ('article_read_time', 'video_read_time') THEN event.duration END), 0)", 'averageReadTime')
            .addSelect("COUNT(CASE WHEN event.eventType = 'article_share' THEN 1 END)", 'shares')
            .addSelect("COUNT(CASE WHEN event.eventType = 'article_favorite' THEN 1 END)", 'favorites')
            .groupBy('article.type')
            .getRawMany();
        const empty = { views: 0, averageReadTime: 0, shares: 0, favorites: 0 };
        const result = { news: { ...empty }, videos: { ...empty } };
        for (const row of rows) {
            const key = row.contentType;
            if (key in result) {
                result[key] = {
                    views: parseInt(row.views, 10) || 0,
                    averageReadTime: parseFloat(row.averageReadTime) || 0,
                    shares: parseInt(row.shares, 10) || 0,
                    favorites: parseInt(row.favorites, 10) || 0,
                };
            }
        }
        return result;
    }
    async cleanupExpiredEvents() {
        const result = await this.analyticsRepository
            .createQueryBuilder()
            .delete()
            .where('expiresAt < NOW()')
            .execute();
        return result.affected || 0;
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(analytics_entity_1.AnalyticsEvent)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map