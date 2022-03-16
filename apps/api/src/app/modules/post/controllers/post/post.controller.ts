import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { Post as PostEntity, Prisma, User } from '@prisma/client';
import { PostService } from '../../services/post/post.service';
import { GetUser } from '../../../auth/decorators/get-user/get-user.decorator';
import { AddCommentOnPostDto } from '../../dto/comment/add-comment-on-post.dto';
import { CreatePostDto } from '../../dto/post/create-post.dto';
import { GetPostsDto } from '../../dto/post/get-posts.dto';

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
      comments: { select: { author: PostController.authorSelect, content: true, createdAt: true, updatedAt: true } },
      author: PostController.authorSelect,
    },
  };

  public constructor(private readonly postService: PostService) {}

  @Get()
  public async getPosts(@Query() { skip, take, sort }: GetPostsDto): Promise<PostEntity[]> {
    const [sortKey, sortOrder] = sort.split(':');
    return this.postService.find({
      where: {
        deletedAt: null,
      },
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
    return await this.postService.addComment(content, postId, user, PostController.postSelect);
  }
}
