import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';

import { PostEntity } from '../post.entity';
import { ResponsePostDTO } from './response-post.dto';

@Exclude()
export class ResponseManyPostsDTO {
  @ApiProperty({
    description: 'Current page number in the paginated result',
    example: 1,
  })
  @Expose()
  @Transform(({ obj }: { obj: { page: number } }) => obj.page)
  page: number;

  @ApiProperty({
    description:
      'Total number of pages based on total posts and limit per page',
    example: 5,
  })
  @Expose()
  @Transform(({ obj }: { obj: { totalPosts: number; limit: number } }) =>
    Math.ceil(obj.totalPosts / obj.limit),
  )
  totalPages: number;

  @ApiProperty({
    description: 'Number of posts shown on the current page',
    example: 15,
  })
  @Expose()
  @Transform(({ obj }: { obj: { posts: PostEntity[] } }) => obj.posts.length)
  docsShown: number;

  @ApiProperty({
    description: 'Total number of posts available',
    example: 63,
  })
  @Expose()
  @Transform(({ obj }: { obj: { totalPosts: number } }) => obj.totalPosts)
  totalDocs: number;

  @ApiProperty({
    description: 'Array of post data for the current page',
    type: [ResponsePostDTO],
  })
  @Expose()
  @Type(() => ResponsePostDTO)
  @Transform(({ obj }: { obj: { posts: PostEntity[] } }) => {
    return obj.posts.map((post) => new ResponsePostDTO(post));
  })
  docs: ResponsePostDTO[];

  constructor(payload) {
    Object.assign(this, payload);
  }
}
