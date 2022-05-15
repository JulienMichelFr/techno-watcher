import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Comment, Prisma, User } from '@prisma/client';

@Injectable()
export class CommentService {
  public constructor(private prisma: PrismaService) {}

  public async createOnPost(content: string, postId: number, commentId: number | null, user: User, args: Prisma.CommentArgs = {}): Promise<Comment> {
    return this.prisma.comment.create({
      data: {
        content,
        post: { connect: { id: postId } },
        author: { connect: { id: user.id } },
        parentComment: commentId ? { connect: { id: commentId } } : undefined,
      },
      ...args,
    });
  }

  public async find(conditions: Prisma.CommentFindManyArgs = {}): Promise<Comment[]> {
    return this.prisma.comment.findMany(conditions);
  }

  public async findOne(conditions: Prisma.CommentFindUniqueArgs): Promise<Comment | null> {
    return this.prisma.comment.findUnique(conditions);
  }

  public async softDeleteComment(commentId: number): Promise<void> {
    await this.prisma.comment.update({
      where: { id: commentId },
      data: { deletedAt: new Date() },
    });
  }
}
