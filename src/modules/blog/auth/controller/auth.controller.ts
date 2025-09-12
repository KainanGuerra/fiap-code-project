import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

import { InnerAuthorize, PublicAuthorize } from '@Shared/decorators';
import { EntityByIdPipe } from '@Shared/pipes/entity-by-id.pipe';

import { CreateUserDto } from '../dto/create-user.dto';
import { ResponseUserDTO } from '../dto/response-user.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { AuthService } from '../service/auth.service';
import { UserEntity } from '../user.entity';

@InnerAuthorize()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: ResponseUserDTO,
  })
  @InnerAuthorize()
  @Post('sign-up')
  async register(@Body() data: CreateUserDto) {
    return this.authService.register(data);
  }

  @ApiOperation({ summary: 'Get a list of all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: [ResponseUserDTO],
  })
  @Get()
  async list() {
    const users = await this.authService.list();
    return users.map((user) => new ResponseUserDTO(user));
  }

  @ApiOperation({ summary: 'Soft delete (remove) a user by ID' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiResponse({ status: 204, description: 'User removed successfully' })
  @Patch(':id/remove')
  async remove(@Param('id', EntityByIdPipe<UserEntity>) user: UserEntity) {
    await this.authService.remove(user);
  }

  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    schema: { example: { accessToken: 'jwt.token.here' } },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @PublicAuthorize()
  @Post('sign-in')
  login(@Body() dto: SignInDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
