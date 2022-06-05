import { IsNotEmpty, IsString } from 'class-validator';

export class AddCommentOnPostDto {
  @IsString()
  @IsNotEmpty()
  public content!: string;
}
