import { Module } from '@nestjs/common';
import { PostService } from './services/post/post.service';
import { PostController } from './controllers/post/post.controller';

@Module({
  imports: [],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
