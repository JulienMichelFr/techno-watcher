import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { Comment, Post as PostEntity, Prisma, User } from '@prisma/client';
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
  };

  private static readonly postSelect: Prisma.PostSelect = {
    id: true,
    title: true,
    link: true,
    content: true,
    createdAt: true,
    updatedAt: true,
    tags: true,
    comments: false,
    author: {
      select: PostController.authorSelect,
    },
    _count: true,
  };

  public constructor(private readonly postService: PostService, private readonly commentService: CommentService) {}

  @Serializer(PostModel)
  @Get()
  @Public()
  public async getPosts(@Query() { skip, take, sort, tags }: GetPostsDto): Promise<Paginated<PostEntity>> {
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

    return this.postService.find(
      {
        where,
        skip,
        take,
        orderBy: [{ [sortKey]: sortOrder }],
        select: PostController.postSelect,
      },
      true
    );
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
    const post: PostEntity = await this.postService.findOne({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }

    if (post.authorId !== user.id) {
      throw new ForbiddenException('You are not allowed to delete this post');
    }

    await this.postService.softDeleteById(postId);
  }
}
