import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { UserEntity } from '../user.entity';

@Exclude()
export class ResponseUserDTO {
  @ApiProperty({ description: 'User full name', example: 'John Doe' })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'Unique user ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Date when the user was created',
    example: '2025-08-03T14:52:00Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the user was last updated',
    example: '2025-08-03T15:10:00Z',
  })
  @Expose()
  updatedAt: Date;

  @ApiProperty({ description: 'User role', example: 'admin' })
  @Expose()
  role: string;

  constructor(partial: UserEntity) {
    Object.assign(this, partial);
  }
}
