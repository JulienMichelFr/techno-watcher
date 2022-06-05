import { AuthorModel } from '../author';

export class CommentModel {
  public id!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
  public content!: string;
  public postId!: number;
  public parentCommentId: number | null = null;
  public deletedAt: Date | null = null;
  public author!: AuthorModel;
}
