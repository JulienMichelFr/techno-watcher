import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { User } from '@prisma/client';
import { PostService } from '../../services/post/post.service';
import { GetUser } from '../../../auth/decorators/get-user/get-user.decorator';
import { AddCommentOnPostDto, CommentModel, CreatePostDto, GetPostsDto, Paginated, PostModel } from '@techno-watcher/api-models';
import { Public } from '../../../auth/decorators/public/public.decorator';
import { CommentService } from '../../services/comments/comment.service';

@Controller('posts')
export class PostController {
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

  @Post(':postId/comments')
  public async addComment(
    @Body() addCommentOnPostDto: AddCommentOnPostDto,
    @GetUser() user: User,
    @Param('postId', ParseIntPipe) postId: number
  ): Promise<CommentModel> {
    return this.commentService.createOnPost(addCommentOnPostDto, postId, user.id, null);
  }

  @Post(':postId/comments/:commentId')
  public async replyToComment(
    @Body() addCommentOnPostDto: AddCommentOnPostDto,
    @GetUser() user: User,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number
  ): Promise<CommentModel> {
    return this.commentService.createOnPost(addCommentOnPostDto, postId, user.id, commentId);
  }

  @Get(':postId/comments')
  @Public()
  public async getCommentsOnPost(@Param('postId', ParseIntPipe) postId: number): Promise<CommentModel[]> {
    return this.commentService.findByPostId(postId);
  }

  @Delete(':postId')
  public async deletePost(@Param('postId', ParseIntPipe) postId: number, @GetUser() user: User): Promise<void> {
    await this.postService.softDeleteById(postId, user.id);
  }
}
