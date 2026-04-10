import { Controller, Get, Param, Patch, Delete, Body, UseGuards } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Article } from './article.entity';
import { JwtAuthGuard } from '../users/auth/jwt-auth.guard';
import { AdminGuard } from '../users/auth/admin.guard';

@Controller('articles')
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) {}

    @Get()
    async findLastForEachType(): Promise<Article[]> {
        return this.articlesService.findLastForEachType();
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Get('all')
    async findAll(): Promise<Article[]> {
        return this.articlesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Article> {
        return this.articlesService.findOne(parseInt(id, 10));
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Patch(':id')
    async update(@Param('id') id: string, @Body() body: Partial<Article>): Promise<Article> {
        return this.articlesService.update(parseInt(id, 10), body);
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        return this.articlesService.delete(parseInt(id, 10));
    }
}
