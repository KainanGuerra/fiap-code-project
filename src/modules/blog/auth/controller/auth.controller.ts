import {
  Body,
  Controller,
  DefaultValuePipe,
  ForbiddenException,
  Get,
  HttpCode,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

import { AuthRoles } from '@Shared/constants/auth.roles.constant';
import {
  InnerAuthorize,
  PublicAuthorize,
  UserAuthorize,
} from '@Shared/decorators';
import { EntityByIdPipe } from '@Shared/pipes/entity-by-id.pipe';

import { CreateUserDto } from '../dto/create-user.dto';
import { ListUsersDto } from '../dto/list-users.dto';
import { ResponseManyUsersDTO } from '../dto/response-many-users.dto';
import { ResponseUserDTO } from '../dto/response-user.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { AuthService } from '../service/auth.service';
import { UserEntity } from '../user.entity';

@InnerAuthorize()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(REQUEST) private request: FastifyRequest,
  ) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: ResponseUserDTO,
  })
  @UserAuthorize()
  @Post('sign-up')
  async register(@Body() data: CreateUserDto) {
    const { strategy } = this.request.state;

    if (['authorized', 'inner'].includes(strategy)) {
      const userRequest =
        'authorized' === strategy ? this.request.state.user : undefined;
      if (userRequest && userRequest.role !== AuthRoles.professor) {
        throw new ForbiddenException(
          'Students are not allowed to create users',
        );
      }
      return this.authService.register(data, userRequest);
    }
    throw new ForbiddenException();
  }

  @ApiOperation({ summary: 'Get a list of all users' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of users per page (default 10)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default 1)',
  })
  @ApiQuery({
    name: 'query',
    required: false,
    type: ListUsersDto,
    description: 'Additional query filters',
  })
  @ApiResponse({
    status: 200,
    description: 'List of users with pagination',
    type: ResponseManyUsersDTO,
  })
  @UserAuthorize()
  @Get()
  async list(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query() query: ListUsersDto,
  ) {
    const { strategy } = this.request.state;

    if (['authorized', 'inner'].includes(strategy)) {
      const userRequest =
        'authorized' === strategy ? this.request.state.user : undefined;
      if (userRequest && userRequest.role !== AuthRoles.professor) {
        throw new ForbiddenException('Students are not allowed to list users');
      }
      return new ResponseManyUsersDTO(
        await this.authService.list({ limit, page }, query),
      );
    }
    throw new ForbiddenException();
  }

  @ApiOperation({ summary: 'Soft delete (remove) a user by ID' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiResponse({ status: 204, description: 'User removed successfully' })
  @UserAuthorize()
  @HttpCode(204)
  @Patch(':id/remove')
  async remove(@Param('id', EntityByIdPipe<UserEntity>) user: UserEntity) {
    const { strategy } = this.request.state;

    if (['authorized', 'inner'].includes(strategy)) {
      const userRequest =
        'authorized' === strategy ? this.request.state.user : undefined;
      if (userRequest && userRequest.role !== AuthRoles.professor) {
        throw new ForbiddenException(
          'Students are not allowed to remove users',
        );
      }
      await this.authService.remove(user);
      return;
    }
    throw new ForbiddenException();
  }

  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: ResponseUserDTO,
  })
  @UserAuthorize()
  @Patch(':id')
  async update(
    @Param('id', EntityByIdPipe<UserEntity>) user: UserEntity,
    @Body() data: UpdateUserDto,
  ) {
    const { strategy } = this.request.state;

    if (['authorized', 'inner'].includes(strategy)) {
      const userRequest =
        'authorized' === strategy ? this.request.state.user : undefined;
      if (userRequest && userRequest.role !== AuthRoles.professor) {
        throw new ForbiddenException(
          'Students are not allowed to update users',
        );
      }
      const updatedUser = await this.authService.update(user, data);
      return new ResponseUserDTO(updatedUser);
    }
    throw new ForbiddenException();
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
