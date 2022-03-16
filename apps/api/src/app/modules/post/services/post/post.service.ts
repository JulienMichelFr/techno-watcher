import { Injectable } from '@nestjs/common';
import { Post, Prisma, User } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class PostService {
  public constructor(private prisma: PrismaService) {}

  public async find(conditions: Prisma.PostFindManyArgs = {}): Promise<Post[]> {
    return this.prisma.post.findMany(conditions);
  }

  public async create(post: Prisma.PostCreateInput, args: Prisma.PostArgs = {}): Promise<Post> {
    return this.prisma.post.create({ data: post, ...args });
  }

  public async addComment(content: string, postId: number, user: User, args: Prisma.PostArgs = {}): Promise<Post> {
    await this.prisma.comment.create({
      data: {
        content,
        post: { connect: { id: postId } },
        author: { connect: { id: user.id } },
      },
    });

    return this.prisma.post.findUnique({
      ...args,
      where: { id: postId },
    });
  }
}
