import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CreateEventBatchDto } from './dto/create-event.dto';
import { AnalyticsEvent } from './analytics.entity';
import { JwtAuthGuard } from '../users/auth/jwt-auth.guard';
import { AdminGuard } from '../users/auth/admin.guard';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('events')
  async createEvents(
    @Body() body: CreateEventBatchDto,
  ): Promise<AnalyticsEvent[]> {
    return this.analyticsService.createEventBatch(body.events);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('articles/:id/stats')
  async getArticleStats(@Param('id') id: string) {
    return this.analyticsService.getArticleStats(parseInt(id, 10));
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('summary')
  async getSummary() {
    return this.analyticsService.getSummary();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('trends')
  async getTrends(@Query('period') period: string) {
    const validPeriod = period === 'week' ? 'week' : 'day';
    return this.analyticsService.getTrends(validPeriod);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('rankings')
  async getRankings(
    @Query('sortBy') sortBy: string,
    @Query('limit') limit: string,
  ) {
    const validSortBy = ['views', 'readTime', 'shares', 'favorites'].includes(sortBy)
      ? (sortBy as 'views' | 'readTime' | 'shares' | 'favorites')
      : 'views';
    const parsedLimit = parseInt(limit, 10) || 10;
    return this.analyticsService.getRankings(validSortBy, parsedLimit);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('content-types')
  async getContentTypeStats() {
    return this.analyticsService.getContentTypeStats();
  }
}
