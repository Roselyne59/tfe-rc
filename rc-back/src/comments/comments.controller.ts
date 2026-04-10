import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './comment.entity';
import { JwtAuthGuard } from '../users/auth/jwt-auth.guard';
import { AdminGuard } from '../users/auth/admin.guard';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Get()
    async findAll(): Promise<Comment[]> {
        return this.commentsService.findAll();
    }

    @Get('article/:articleId')
    async findByArticle(@Param('articleId') articleId: string): Promise<Comment[]> {
        return this.commentsService.findByArticle(parseInt(articleId, 10));
    }

    @Post()
    async create(@Body() dto: CreateCommentDto): Promise<Comment> {
        return this.commentsService.create(dto);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body('content') content: string): Promise<Comment> {
        return this.commentsService.update(parseInt(id, 10), content);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        return this.commentsService.delete(parseInt(id, 10));
    }
}
