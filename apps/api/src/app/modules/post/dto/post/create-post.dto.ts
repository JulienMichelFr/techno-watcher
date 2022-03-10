import { IsNotEmpty, IsString } from 'class-validator';
import { Prisma } from '@prisma/client';

export class CreatePostDto implements Pick<Prisma.PostCreateInput, 'title' | 'content'> {
  @IsNotEmpty()
  @IsString()
  public title: string;
  @IsString()
  public content: string;
}
