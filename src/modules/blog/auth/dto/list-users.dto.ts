import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional } from 'class-validator';

import { AuthRoles } from '@Shared/constants/auth.roles.constant';

export class ListUsersDto {
  @ApiPropertyOptional({
    description: 'Filter by email',
    example: 'user@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Filter by role',
    enum: AuthRoles,
    example: AuthRoles.professor,
  })
  @IsOptional()
  @IsEnum(AuthRoles)
  role?: AuthRoles;
}
