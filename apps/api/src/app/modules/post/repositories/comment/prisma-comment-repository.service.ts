import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepositoryService } from './comment-repository.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { AddCommentOnPostDto, AuthorModel, CommentModel } from '@techno-watcher/api-models';
import { Comment, Prisma } from '@prisma/client';

export type CommentAndSelect = Omit<Comment, 'authorId'> & { author: { id: number; username: string } };

@Injectable()
export class PrismaCommentRepositoryService extends CommentRepositoryService {
  private readonly commentSelect: Prisma.CommentSelect = {
    id: true,
    author: {
      select: {
        id: true,
        username: true,
      },
    },
    content: true,
    createdAt: true,
    updatedAt: true,
    postId: true,
    parentCommentId: true,
    deletedAt: true,
  };

  public constructor(private prisma: PrismaService) {
    super();
  }

  public createCommentModel(comment: CommentAndSelect): CommentModel {
    const author: AuthorModel = new AuthorModel();
    author.id = comment.author.id;
    author.username = comment.author.username;

    const result: CommentModel = new CommentModel();
    result.id = comment.id;
    result.content = comment.content;
    result.createdAt = comment.createdAt;
    result.updatedAt = comment.updatedAt;
    result.parentCommentId = comment.parentCommentId;
    result.deletedAt = comment.deletedAt;
    result.postId = comment.postId;
    result.author = author;

    return result;
  }

  public override async createOnPost(
    addCommentOnPostDto: AddCommentOnPostDto,
    postId: number,
    userId: number,
    parentCommentId: number | null = null
  ): Promise<CommentModel> {
    const createdComment: CommentAndSelect = (await this.prisma.comment.create({
      data: {
        ...addCommentOnPostDto,
        post: { connect: { id: postId } },
        author: { connect: { id: userId } },
        parentComment: parentCommentId ? { connect: { id: parentCommentId } } : undefined,
      },
      select: this.commentSelect,
    })) as CommentAndSelect;

    return this.createCommentModel(createdComment);
  }

  public override async findByPostId(postId: number): Promise<CommentModel[]> {
    const comments: CommentAndSelect[] = (await this.prisma.comment.findMany({
      where: { postId },
      select: this.commentSelect,
    })) as CommentAndSelect[];

    return comments.map((comment) => this.createCommentModel(comment));
  }

  public override async findById(id: number): Promise<CommentModel> {
    const comment: CommentAndSelect = (await this.prisma.comment.findUnique({
      where: { id },
      select: this.commentSelect,
    })) as CommentAndSelect;

    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }

    return this.createCommentModel(comment);
  }

  public override async softDeleteById(id: number): Promise<void> {
    await this.prisma.comment.update({
      where: { id: id },
      data: { deletedAt: new Date() },
    });
  }

  public override async softDeleteByPostId(postId: number): Promise<void> {
    await this.prisma.comment.updateMany({
      where: { postId: postId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }
}
