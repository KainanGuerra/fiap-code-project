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
  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @IsString()
  @Matches(/^[a-zA-Z\s'-]{2,50}$/, {
    message: 'Name must contain only letters, spaces, apostrophes, or hyphens',
  })
  name: string;

  @Expose()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;

  @Expose()
  @IsEnum(AuthRoles)
  role: AuthRoles;
}
