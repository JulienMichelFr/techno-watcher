import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { Post as PostEntity, Prisma, User } from '@prisma/client';
import { PostService } from '../../services/post/post.service';
import { GetUser } from '../../../auth/decorators/get-user/get-user.decorator';
import { AddCommentOnPostDto, CreatePostDto, GetPostsDto, Paginated, PostModel } from '@techno-watcher/api-models';
import { Public } from '../../../auth/decorators/public/public.decorator';
import { plainToClass } from 'class-transformer';
import { Serializer } from '../../../../decorators/serializer/serializer.decorator';

@Controller('posts')
export class PostController {
  private static readonly authorSelect: Prisma.UserSelect = {
    username: true,
  };

  private static readonly postSelect: Prisma.PostSelect = {
    id: true,
    title: true,
    content: true,
    createdAt: true,
    updatedAt: true,
    tags: true,
    comments: {
      select: {
        id: true,
        author: { select: PostController.authorSelect },
        content: true,
        createdAt: true,
        updatedAt: true,
        parentCommentId: true,
        _count: {
          select: { comments: true },
        },
      },
    },
    author: {
      select: PostController.authorSelect,
    },
    _count: true,
  };

  public constructor(private readonly postService: PostService) {}

  @Serializer(PostModel)
  @Get()
  @Public()
  public async getPosts(@Query() { skip, take, sort, tags }: GetPostsDto): Promise<Paginated<PostModel>> {
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

    const result: Paginated<PostEntity> = await this.postService.find(
      {
        where,
        skip,
        take,
        orderBy: [{ [sortKey]: sortOrder }],
        select: {
          ...PostController.postSelect,
          comments: false,
        },
      },
      true
    );

    return {
      ...result,
      data: result.data.map((post) => plainToClass(PostModel, post)),
    };
  }

  @Serializer(PostModel)
  @Get(':id')
  @Public()
  public async getPost(@Param('id', ParseIntPipe) id: number): Promise<PostEntity> {
    return this.postService.findOne({
      where: {
        id,
      },
      select: PostController.postSelect,
    });
  }

  @Serializer(PostModel)
  @Post()
  public async create(@Body() post: CreatePostDto, @GetUser() user: User): Promise<PostEntity> {
    return await this.postService.create({ ...post, author: { connect: { id: user.id } } }, { select: PostController.postSelect });
  }

  @Serializer(PostModel)
  @Post(':postId/comments')
  public async addComment(@Body() { content }: AddCommentOnPostDto, @GetUser() user: User, @Param('postId', ParseIntPipe) postId: number): Promise<PostEntity> {
    return await this.postService.addComment(content, postId, null, user, { select: PostController.postSelect });
  }

  @Serializer(PostModel)
  @Post(':postId/comments/:commentId')
  public async replyToComment(
    @Body() { content }: AddCommentOnPostDto,
    @GetUser() user: User,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number
  ): Promise<PostEntity> {
    return await this.postService.addComment(content, postId, commentId, user, { select: PostController.postSelect });
  }
}
