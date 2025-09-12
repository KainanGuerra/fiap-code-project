import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString, MinLength } from 'class-validator';

@Exclude()
export class GetPostsDTO {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @Expose()
  term?: string;
}
