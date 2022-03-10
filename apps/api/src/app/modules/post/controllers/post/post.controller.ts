import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Post as PostEntity, User } from '@prisma/client';
import { PostService } from '../../services/post/post.service';
import { GetUser } from '../../../auth/decorators/get-user/get-user.decorator';
import { AddCommentOnPostDto } from '../../dto/comment/add-comment-on-post.dto';
import { CreatePostDto } from '../../dto/post/create-post.dto';
import { GetPostsDto } from '../../dto/post/get-posts.dto';

@Controller('posts')
export class PostController {
  public constructor(private readonly postService: PostService) {}

  @Get()
  public async getPosts(@Query() { skip, take, sort }: GetPostsDto): Promise<PostEntity[]> {
    const [sortKey, sortOrder] = sort.split(':');
    return this.postService.find({
      skip,
      take,
      orderBy: [{ [sortKey]: sortOrder }],
    });
  }

  @Post()
  public async create(@Body() post: CreatePostDto, @GetUser() user: User): Promise<PostEntity> {
    return await this.postService.create({ ...post, author: { connect: { id: user.id } } });
  }

  @Post(':postId/comments')
  public async addComment(@Body() { content }: AddCommentOnPostDto, @GetUser() user: User, @Param('postId') postId: number): Promise<PostEntity> {
    return await this.postService.addComment(content, postId, user);
  }
}
