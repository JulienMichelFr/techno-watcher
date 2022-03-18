import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { Post as PostEntity, Prisma, User } from '@prisma/client';
import { PostService } from '../../services/post/post.service';
import { GetUser } from '../../../auth/decorators/get-user/get-user.decorator';
import { AddCommentOnPostDto } from '../../dto/comment/add-comment-on-post.dto';
import { CreatePostDto } from '../../dto/post/create-post.dto';
import { GetPostsDto } from '../../dto/post/get-posts.dto';
import { Public } from '../../../auth/decorators/public/public.decorator';

@Controller('posts')
export class PostController {
  private static readonly authorSelect: Prisma.UserArgs = {
    select: {
      username: true,
    },
  };
  private static readonly postSelect: Prisma.PostArgs = {
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      tags: true,
      comments: { select: { id: true, author: PostController.authorSelect, content: true, createdAt: true, updatedAt: true, parentCommentId: true } },
      author: PostController.authorSelect,
    },
  };

  public constructor(private readonly postService: PostService) {}

  @Get()
  @Public()
  public async getPosts(@Query() { skip, take, sort, tags }: GetPostsDto): Promise<PostEntity[]> {
    const [sortKey, sortOrder] = sort.split(':');
    let where: Prisma.PostWhereInput = {
      deletedAt: null,
    };
    if (tags?.length) {
      where = {
        ...where,
        tags: {
          hasSome: tags,
        },
      };
    }

    return this.postService.find({
      where,
      skip,
      take,
      orderBy: [{ [sortKey]: sortOrder }],
      ...PostController.postSelect,
    });
  }

  @Post()
  public async create(@Body() post: CreatePostDto, @GetUser() user: User): Promise<PostEntity> {
    return await this.postService.create({ ...post, author: { connect: { id: user.id } } }, PostController.postSelect);
  }

  @Post(':postId/comments')
  public async addComment(@Body() { content }: AddCommentOnPostDto, @GetUser() user: User, @Param('postId', ParseIntPipe) postId: number): Promise<PostEntity> {
    return await this.postService.addComment(content, postId, null, user, PostController.postSelect);
  }

  @Post(':postId/comments/:commentId')
  public async replyToComment(
    @Body() { content }: AddCommentOnPostDto,
    @GetUser() user: User,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number
  ): Promise<PostEntity> {
    return await this.postService.addComment(content, postId, commentId, user, PostController.postSelect);
  }
}
