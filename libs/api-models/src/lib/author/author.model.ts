import { Expose } from 'class-transformer';

export class AuthorModel {
  @Expose()
  public id!: number;
  @Expose()
  public username!: string;
}
