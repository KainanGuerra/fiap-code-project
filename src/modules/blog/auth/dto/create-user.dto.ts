import { IsEmail, IsEnum, MinLength } from 'class-validator';

import { AuthRoles } from '@Shared/constants/auth.roles.constant';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsEnum(AuthRoles)
  role: AuthRoles;
}
