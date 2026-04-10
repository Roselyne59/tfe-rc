import { forwardRef, Module } from '@nestjs/common';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { ArticlesModule } from '../articles.module';

@Module({
  imports: [forwardRef(() => ArticlesModule)],
  providers: [VideosService],
  controllers: [VideosController]
})
export class VideosModule {}
