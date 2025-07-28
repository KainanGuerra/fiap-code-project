import { Exclude, Expose, Type } from 'class-transformer';

import { ResponseUserDTO } from '@Modules/blog/auth/dto/response-user.dto';

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

  @Expose()
  @Type(() => ResponseUserDTO)
  user: ResponseUserDTO;

  constructor(partial: PostEntity) {
    Object.assign(this, partial);
  }
}
