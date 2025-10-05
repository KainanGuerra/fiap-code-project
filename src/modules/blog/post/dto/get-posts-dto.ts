import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

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

  @ApiProperty({
    description: 'Email of the author of the posts',
    example: 'john.doe@gmail.com',
  })
  @IsOptional()
  @IsEmail()
  @Expose()
  author?: string;
}
