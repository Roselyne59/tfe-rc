import { Injectable, NotFoundException } from '@nestjs/common';
import { Article } from './article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleType } from './enum/ArticleType.enum';

@Injectable()
export class ArticlesService {
    constructor(
        @InjectRepository(Article)
        private readonly articleRepository: Repository<Article>,
    ) {}

    async creeateBaseArticle(data: {
        userId?: number;
        title: string;
        content: string;
        type: ArticleType;
        isActive: boolean;
        metadata?: Record<string, any>;
    }): Promise<Article> {
        const article = this.articleRepository.create(data);
        return this.articleRepository.save(article);
    }

    async findAll(): Promise<Article[]> {
        return this.articleRepository.find({
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
    }

    async findAllByType(type: ArticleType): Promise<Article[]> {
        return this.articleRepository.find({
            where: { type },
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: number): Promise<Article> {
        const article = await this.articleRepository.findOneBy({ id });
        if (!article) {
            throw new NotFoundException(`Article with ID ${id} not found`);
        }
        return article;
    }

    async findLastForEachType(): Promise<Article[]> {
        return this.articleRepository
            .createQueryBuilder('article')
            .distinctOn(['article.type'])
            .orderBy('article.type', 'ASC')
            .addOrderBy('article.createdAt', 'DESC')
            .getMany();
    }

    async update(id: number, data: Partial<Article>): Promise<Article> {
        const article = await this.findOne(id);
        Object.assign(article, data);
        return this.articleRepository.save(article);
    }

    async delete(id: number): Promise<void> {
        const article = await this.findOne(id);
        await this.articleRepository.remove(article);
    }

    async count(): Promise<number> {
        return this.articleRepository.count();
    }
}
