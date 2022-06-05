import { AuthorModel } from '../author';

export class PostModel {
  public id!: number;
  public title!: string;
  public link!: string;
  public content: string | null = null;
  public createdAt!: Date;
  public updatedAt!: Date;
  public tags: string[] = [];
  public totalComments!: number;
  public author!: AuthorModel;
}
