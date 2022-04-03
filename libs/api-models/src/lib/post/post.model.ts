import { Post } from '@prisma/client';
import { Expose, Transform, Type } from 'class-transformer';
import { CommentModel } from '../comment';
import { AuthorModel } from '../author';

export class PostModel implements Omit<Post, 'authorId' | 'deletedAt'> {
  @Expose()
  public id!: number;
  @Expose()
  public title!: string;
  @Expose()
  public content: string | null = null;
  @Expose()
  public authorId!: number;
  @Expose()
  public createdAt!: Date;
  @Expose()
  public updatedAt!: Date;
  @Expose()
  public tags: string[] = [];
  @Expose()
  public commentCount!: number;

  @Expose()
  @Type(() => AuthorModel)
  public author!: AuthorModel;

  @Expose()
  @Type(() => CommentModel)
  public comments?: CommentModel[] = undefined;

  @Expose()
  @Transform(({ obj }) => obj?._count?.comments ?? obj?.comments?.length)
  public totalComments?: number;
}
