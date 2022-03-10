import { Body, Controller, Post } from '@nestjs/common';
import { Post as PostEntity, Prisma, User } from '@prisma/client';
import { PostService } from '../../services/post/post.service';
import { GetUser } from '../../../auth/decorators/get-user/get-user.decorator';

@Controller('posts')
export class PostController {
  public constructor(private readonly postService: PostService) {}

  @Post()
  public async create(@Body() post: Prisma.PostCreateInput, @GetUser() user: User): Promise<PostEntity> {
    return await this.postService.create({ ...post, author: { connect: { id: user.id } } });
  }
}
