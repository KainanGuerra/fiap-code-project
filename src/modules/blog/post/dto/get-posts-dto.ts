import { IsOptional, IsString, MinLength } from 'class-validator';

export class GetPostsDTO {
  @IsOptional()
  @IsString()
  @MinLength(3)
  term?: string;
}
