import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Post } from '@prisma/client';
import { Sort } from '../../../../types/sort.type';

type PostSort = Sort<Post>;

export class GetPostsDto {
  @Type(() => Number)
  @IsInt()
  @Max(200)
  @Min(1)
  public take: number = 10;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  public skip: number = 0;

  @IsString()
  public sort: PostSort = 'createdAt:desc';

  @IsOptional()
  @Transform(({ value }) => value?.split(',') ?? [])
  public tags: string[] = [];
}
