import { Injectable } from '@nestjs/common';
import { Post, Prisma, User } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class PostService {
  public constructor(private prisma: PrismaService) {}

  public async find(conditions: Prisma.PostFindManyArgs = {}): Promise<Post[]> {
    return this.prisma.post.findMany({
      include: {
        comments: true,
        author: true,
      },
      ...conditions,
    });
  }

  public async create(post: Prisma.PostCreateInput): Promise<Post> {
    return this.prisma.post.create({ data: post, include: { comments: true, author: true } });
  }

  public async addComment(content: string, postId: number, user: User): Promise<Post> {
    await this.prisma.comment.create({
      data: {
        content,
        post: { connect: { id: postId } },
        author: { connect: { id: user.id } },
      },
    });

    return this.prisma.post.findUnique({ where: { id: postId }, include: { comments: true, author: true } });
  }
}
