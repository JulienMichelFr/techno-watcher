import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { Comment, Prisma, User } from '@prisma/client';
import { PostService } from '../../services/post/post.service';
import { GetUser } from '../../../auth/decorators/get-user/get-user.decorator';
import { AddCommentOnPostDto, CommentModel, CreatePostDto, GetPostsDto, Paginated, PostModel } from '@techno-watcher/api-models';
import { Public } from '../../../auth/decorators/public/public.decorator';
import { Serializer } from '../../../../decorators/serializer/serializer.decorator';
import { CommentService } from '../../services/comments/comment.service';

@Controller('posts')
export class PostController {
  private static readonly authorSelect: Prisma.UserSelect = {
    username: true,
  };

  private static readonly commentSelect: Prisma.CommentSelect = {
    id: true,
    author: { select: PostController.authorSelect },
    content: true,
    createdAt: true,
    updatedAt: true,
    parentCommentId: true,
    deletedAt: true,
  };

  public constructor(private readonly postService: PostService, private readonly commentService: CommentService) {}

  @Get()
  @Public()
  public async getPosts(@Query() getPostsDto: GetPostsDto): Promise<Paginated<PostModel>> {
    return this.postService.find(getPostsDto);
  }

  @Get(':id')
  @Public()
  public async getPost(@Param('id', ParseIntPipe) id: number): Promise<PostModel> {
    return this.postService.findById(id);
  }

  @Post()
  public async create(@Body() post: CreatePostDto, @GetUser() user: User): Promise<PostModel> {
    return await this.postService.create(post, user.id);
  }

  @Serializer(CommentModel)
  @Post(':postId/comments')
  public async addComment(@Body() { content }: AddCommentOnPostDto, @GetUser() user: User, @Param('postId', ParseIntPipe) postId: number): Promise<Comment> {
    return this.commentService.createOnPost(content, postId, null, user, { select: PostController.commentSelect });
  }

  @Serializer(CommentModel)
  @Post(':postId/comments/:commentId')
  public async replyToComment(
    @Body() { content }: AddCommentOnPostDto,
    @GetUser() user: User,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number
  ): Promise<Comment> {
    return this.commentService.createOnPost(content, postId, commentId, user, { select: PostController.commentSelect });
  }

  @Serializer(CommentModel)
  @Get(':postId/comments')
  @Public()
  public async getCommentsOnPost(@Param('postId', ParseIntPipe) postId: number): Promise<Comment[]> {
    return this.commentService.find({
      where: {
        post: {
          id: postId,
        },
      },
      select: PostController.commentSelect,
    });
  }

  @Delete(':postId')
  public async deletePost(@Param('postId', ParseIntPipe) postId: number, @GetUser() user: User): Promise<void> {
    await this.postService.softDeleteById(postId, user.id);
  }
}
