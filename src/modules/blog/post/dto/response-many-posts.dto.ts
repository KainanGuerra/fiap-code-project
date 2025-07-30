import { Exclude, Expose, Transform, Type } from 'class-transformer';

import { PostEntity } from '../post.entity';
import { ResponsePostDTO } from './response-post.dto';

@Exclude()
export class ResponseManyPostsDTO {
  @Expose()
  @Transform(({ obj }: { obj: { page: number } }) => obj.page)
  page: number;

  @Expose()
  @Transform(({ obj }: { obj: { totalPosts: number; limit: number } }) =>
    Math.ceil(obj.totalPosts / obj.limit),
  )
  totalPages: number;

  @Expose()
  @Transform(({ obj }: { obj: { posts: PostEntity[] } }) => obj.posts.length)
  docsShown: number;

  @Expose()
  @Transform(({ obj }: { obj: { totalPosts: number } }) => obj.totalPosts)
  totalDocs: number;

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
