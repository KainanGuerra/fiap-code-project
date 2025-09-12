import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { ResponseUserDTO } from '@Modules/blog/auth/dto/response-user.dto';

import { PostEntity } from '../post.entity';

@Exclude()
export class ResponsePostDTO {
  @ApiProperty({
    description: 'Unique identifier of the post',
    example: 'pst_8a1f1c20c3451',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Title of the post',
    example: 'How to learn NestJS',
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'Content of the post',
    example: 'Start with the official documentation...',
  })
  @Expose()
  content: string;

  @ApiProperty({
    description: 'Date when the post was created',
    example: '2025-08-03T14:52:00Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the post was last updated',
    example: '2025-08-03T15:10:00Z',
  })
  @Expose()
  updateAt: Date;

  @ApiProperty({
    description: 'User who created the post',
    type: () => ResponseUserDTO,
  })
  @Expose()
  @Type(() => ResponseUserDTO)
  user: ResponseUserDTO;

  constructor(partial: PostEntity) {
    Object.assign(this, partial);
  }
}
