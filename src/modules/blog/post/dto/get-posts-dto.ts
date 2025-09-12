import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

@Exclude()
export class GetPostsDTO {
  @ApiProperty({
    description: 'Word used to search for posts',
    example: 'Nest',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @Expose()
  term?: string;
}
