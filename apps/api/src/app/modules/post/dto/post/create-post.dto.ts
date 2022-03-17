import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Prisma } from '@prisma/client';
import { Transform } from 'class-transformer';

export class CreatePostDto implements Pick<Prisma.PostCreateInput, 'title' | 'content' | 'tags'> {
  @IsNotEmpty()
  @IsString()
  public title: string;
  @IsString()
  public content: string;

  @Transform(({ value }) => [...new Set(value)].filter(Boolean))
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(20, { each: true })
  @IsOptional()
  public tags: string[] = [];
}
