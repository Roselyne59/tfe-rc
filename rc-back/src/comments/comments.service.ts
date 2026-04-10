import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
    ) {}

    async findAll(): Promise<Comment[]> {
        return this.commentRepository.find({
            relations: ['article'],
            order: { createdAt: 'DESC' },
        });
    }

    async findByArticle(articleId: number): Promise<Comment[]> {
        return this.commentRepository.find({
            where: { articleId },
            order: { createdAt: 'ASC' },
        });
    }

    async create(dto: CreateCommentDto): Promise<Comment> {
        const comment = this.commentRepository.create(dto);
        return this.commentRepository.save(comment);
    }

    async update(id: number, content: string): Promise<Comment> {
        const comment = await this.commentRepository.findOneBy({ id });
        if (!comment) {
            throw new NotFoundException(`Comment with ID ${id} not found`);
        }
        comment.content = content;
        return this.commentRepository.save(comment);
    }

    async delete(id: number): Promise<void> {
        const comment = await this.commentRepository.findOneBy({ id });
        if (!comment) {
            throw new NotFoundException(`Comment with ID ${id} not found`);
        }
        await this.commentRepository.remove(comment);
    }
}
