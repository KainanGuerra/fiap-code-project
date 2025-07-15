import { Exclude, Expose } from 'class-transformer';

import { PostEntity } from '../post.entity';

@Exclude()
export class ResponsePostDTO {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updateAt: Date;

  constructor(partial: PostEntity) {
    Object.assign(this, partial);
  }
}
