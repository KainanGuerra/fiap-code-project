import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsString,
  IsStrongPassword,
  Matches,
} from 'class-validator';

import { AuthRoles } from '@Shared/constants/auth.roles.constant';

@Exclude()
export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @Expose()
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      "User's full name. Allowed: letters, spaces, apostrophes, hyphens",
    example: "John O'Connor",
    minLength: 2,
    maxLength: 50,
  })
  @Expose()
  @IsString()
  @Matches(/^[a-zA-Z\s'-]{2,50}$/, {
    message: 'Name must contain only letters, spaces, apostrophes, or hyphens',
  })
  name: string;

  @ApiProperty({
    description:
      'Strong password with min 8 chars, including uppercase, lowercase, number, and symbol',
    example: 'Str0ngP@ssword!',
    minLength: 8,
  })
  @Expose()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;

  @ApiProperty({
    description: 'User role',
    enum: AuthRoles,
    example: AuthRoles.professor,
  })
  @Expose()
  @IsEnum(AuthRoles)
  role: AuthRoles;
}
