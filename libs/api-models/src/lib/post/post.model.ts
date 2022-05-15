import { Post } from '@prisma/client';
import { Expose, Transform, Type } from 'class-transformer';
import { AuthorModel } from '../author';

export class PostModel implements Omit<Post, 'authorId' | 'deletedAt'> {
  @Expose()
  public id!: number;
  @Expose()
  public title!: string;
  @Expose()
  public link!: string;
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
  @Transform(({ obj }) => obj?._count?.comments ?? obj?.comments?.length)
  public totalComments?: number;
}
