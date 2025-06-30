import { Body, Controller, Post } from '@nestjs/common';

import { InnerAuthorize } from '@Shared/decorators';

import { CreateUserDto } from '../dto/create-user.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @InnerAuthorize()
  @Post('sign-up')
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Post('sign-in')
  login(@Body() dto: SignInDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
