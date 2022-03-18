import type { Prisma } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddCommentOnPostDto implements Pick<Prisma.CommentCreateInput, 'content'> {
  @IsString()
  @IsNotEmpty()
  public content!: string;
}
