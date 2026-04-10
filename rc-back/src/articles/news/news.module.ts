import { forwardRef, Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { Article } from '../article.entity';
import { ArticlesModule } from '../articles.module';

@Module({
  imports: [forwardRef(() => ArticlesModule)],
  providers: [NewsService],
  controllers: [NewsController]
})
export class NewsModule {}
