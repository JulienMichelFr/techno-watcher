import { Module } from '@nestjs/common';
import { PostService } from './services/post/post.service';
import { PostController } from './controllers/post/post.controller';
import { CommentService } from './services/comments/comment.service';
import { CommentController } from './controllers/comment/comment.controller';
import { PrismaPostRepositoryService } from './repositories/post/prisma-post-repository.service';
import { PostRepositoryService } from './repositories/post/post-repository.service';
import { PrismaCommentRepositoryService } from './repositories/comment/prisma-comment-repository.service';
import { CommentRepositoryService } from './repositories/comment/comment-repository.service';

@Module({
  imports: [],
  providers: [
    PostService,
    CommentService,
    { provide: PostRepositoryService, useClass: PrismaPostRepositoryService },
    { provide: CommentRepositoryService, useClass: PrismaCommentRepositoryService },
  ],
  controllers: [PostController, CommentController],
})
export class PostModule {}
