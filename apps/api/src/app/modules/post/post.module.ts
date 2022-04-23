import { Module } from '@nestjs/common';
import { PostService } from './services/post/post.service';
import { PostController } from './controllers/post/post.controller';
import { CommentService } from './services/comments/comment.service';

@Module({
  imports: [],
  providers: [PostService, CommentService],
  controllers: [PostController],
})
export class PostModule {}
