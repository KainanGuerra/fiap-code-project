import { Exclude, Expose } from 'class-transformer';

import { UserEntity } from '../user.entity';

@Exclude()
export class ResponseUserDTO {
  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  id: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  role: string;

  constructor(partial: UserEntity) {
    Object.assign(this, partial);
  }
}
