import { IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  public title!: string;

  @IsNotEmpty()
  @IsUrl()
  public link!: string;

  @IsString()
  @IsOptional()
  public content?: string;

  @Transform(({ value }) => [...new Set(value)].filter(Boolean))
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(20, { each: true })
  @IsOptional()
  public tags: string[] = [];
}
