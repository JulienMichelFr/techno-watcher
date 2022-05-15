import { Comment } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { AuthorModel } from '../author';

export class CommentModel implements Omit<Comment, 'postId' | 'authorId'> {
  @Expose()
  public id!: number;
  @Expose()
  public createdAt!: Date;
  @Expose()
  public updatedAt!: Date;
  @Expose()
  public content!: string;
  @Expose()
  public parentCommentId: number | null = null;

  @Expose()
  public deletedAt: Date | null = null;

  @Expose()
  @Type(() => AuthorModel)
  public author!: AuthorModel;
}
