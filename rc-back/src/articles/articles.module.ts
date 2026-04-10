import { forwardRef, Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './article.entity'; // Import your entity here
import { NewsModule } from './news/news.module';
import { VideosModule } from './videos/videos.module';
import { CommunityModule } from './community/community.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article]),
    forwardRef(() => NewsModule), // Use forwardRef if NewsModule imports ArticlesModule
    forwardRef(() => VideosModule), // Use forwardRef if VideosModule imports ArticlesModule
    CommunityModule,
  ], // Add your entities here if needed
  controllers: [ArticlesController],
  providers: [ArticlesService],
  exports: [ArticlesService], // Export the service if needed in other modules
})
export class ArticlesModule {}
