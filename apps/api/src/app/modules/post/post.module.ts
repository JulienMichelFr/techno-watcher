import { Module } from '@nestjs/common';
import { PostService } from './services/post/post.service';
import { PostController } from './controllers/post/post.controller';
import { CommentService } from './services/comments/comment.service';
import { CommentController } from './controllers/comment/comment.controller';
import { PrismaPostRepositoryService } from './repositories/post/post-repository/prisma-post-repository.service';
import { PostRepositoryService } from './repositories/post/post-repository/post-repository.service';

@Module({
  imports: [],
  providers: [PostService, CommentService, { provide: PostRepositoryService, useClass: PrismaPostRepositoryService }],
  controllers: [PostController, CommentController],
})
export class PostModule {}
