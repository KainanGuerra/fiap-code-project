import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

import { InnerAuthorize, PublicAuthorize } from '@Shared/decorators';
import { EntityByIdPipe } from '@Shared/pipes/entity-by-id.pipe';

import { CreateUserDto } from '../dto/create-user.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { AuthService } from '../service/auth.service';
import { UserEntity } from '../user.entity';

@InnerAuthorize()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @InnerAuthorize()
  @Post('sign-up')
  async register(@Body() data: CreateUserDto) {
    return this.authService.register(data);
  }

  @Get()
  async list() {
    return this.authService.list();
  }

  @Patch(':id/remove')
  async remove(@Param('id', EntityByIdPipe<UserEntity>) user: UserEntity) {
    await this.authService.remove(user);
  }

  @PublicAuthorize()
  @Post('sign-in')
  login(@Body() dto: SignInDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
