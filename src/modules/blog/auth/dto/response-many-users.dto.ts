import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';

import { UserEntity } from '../user.entity';
import { ResponseUserDTO } from './response-user.dto';

@Exclude()
export class ResponseManyUsersDTO {
  @ApiProperty({
    description: 'Current page number in the paginated result',
    example: 1,
  })
  @Expose()
  @Transform(({ obj }: { obj: { page: number } }) => obj.page)
  page: number;

  @ApiProperty({
    description:
      'Total number of pages based on total users and limit per page',
    example: 5,
  })
  @Expose()
  @Transform(({ obj }: { obj: { totalUsers: number; limit: number } }) =>
    Math.ceil(obj.totalUsers / obj.limit),
  )
  totalPages: number;

  @ApiProperty({
    description: 'Number of users shown on the current page',
    example: 15,
  })
  @Expose()
  @Transform(({ obj }: { obj: { users: UserEntity[] } }) => obj.users.length)
  docsShown: number;

  @ApiProperty({
    description: 'Total number of users available',
    example: 63,
  })
  @Expose()
  @Transform(({ obj }: { obj: { totalUsers: number } }) => obj.totalUsers)
  totalDocs: number;

  @ApiProperty({
    description: 'Array of user data for the current page',
    type: [ResponseUserDTO],
  })
  @Expose()
  @Type(() => ResponseUserDTO)
  @Transform(({ obj }: { obj: { users: UserEntity[] } }) => {
    return obj.users.map((user) => new ResponseUserDTO(user));
  })
  docs: ResponseUserDTO[];

  constructor(payload) {
    Object.assign(this, payload);
  }
}
