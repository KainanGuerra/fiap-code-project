import {
  Body,
  Controller,
  DefaultValuePipe,
  ForbiddenException,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

import { StateRole } from '@App/@types/FastifyRequest';
import { InnerAuthorize, UserAuthorize } from '@Shared/decorators';
import { EntityByIdPipe } from '@Shared/pipes/entity-by-id.pipe';

import { CreatePostDTO } from '../dto/create-post.dto';
import { GetPostsDTO } from '../dto/get-posts-dto';
import { ResponseManyPostsDTO } from '../dto/response-many-posts.dto';
import { ResponsePostDTO } from '../dto/response-post.dto';
import { UpdatePostDTO } from '../dto/update-post.dto';
import { PostEntity } from '../post.entity';
import { PostService } from '../services/post.service';

@InnerAuthorize()
@UserAuthorize()
@Controller('posts')
export class PublicationController {
  constructor(
    private readonly service: PostService,
    @Inject(REQUEST) private request: FastifyRequest,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a paginated list of posts' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of posts per page (default 10)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default 1)',
  })
  @ApiQuery({
    name: 'otherFilters',
    required: false,
    type: GetPostsDTO,
    description: 'Additional query filters',
  })
  @ApiResponse({
    status: 200,
    description: 'List of posts',
    type: ResponseManyPostsDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Get()
  async find(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query() query: GetPostsDTO,
  ) {
    const { strategy } = this.request.state;
    if (['authorized', 'inner'].includes(strategy)) {
      const user =
        'authorized' === strategy ? this.request.state.user : undefined;
      return new ResponseManyPostsDTO(
        await this.service.find({ limit, page }, user, query),
      );
    }
    throw new ForbiddenException();
  }

  @ApiOperation({ summary: 'Get a single post by ID' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: String, description: 'Post ID' })
  @ApiResponse({
    status: 200,
    description: 'The post found',
    type: ResponsePostDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const { strategy } = this.request.state;

    if (['authorized', 'inner'].includes(strategy)) {
      return new ResponsePostDTO(await this.service.findOne(id));
    }
    throw new ForbiddenException();
  }

  @ApiOperation({ summary: 'Create a new post' })
  @ApiBearerAuth()
  @ApiBody({ type: CreatePostDTO })
  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
    type: ResponsePostDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Post()
  async create(@Body() payload: CreatePostDTO) {
    const { strategy, role } = this.request.state;

    if ('authorized' === strategy && role === StateRole.PROFESSOR) {
      const data = await this.service.create(
        payload,
        this.request?.state?.user,
      );
      return new ResponsePostDTO(data);
    }
    throw new ForbiddenException();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a post by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Post ID' })
  @ApiBody({ type: UpdatePostDTO })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
    type: ResponsePostDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiBearerAuth()
  async update(
    @Param('id', EntityByIdPipe<PostEntity>) post: PostEntity,
    @Body() payload: UpdatePostDTO,
  ) {
    const { strategy } = this.request.state;

    if (['authorized', 'inner'].includes(strategy)) {
      const data = await this.service.update(payload, post);
      return new ResponsePostDTO(data);
    }
    throw new ForbiddenException();
  }

  @ApiOperation({ summary: 'Soft delete (remove) a post by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Post ID' })
  @ApiResponse({
    status: 200,
    description: 'Post removed successfully',
    type: ResponsePostDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiBearerAuth()
  @Patch(':id/remove')
  async remove(@Param('id', EntityByIdPipe<PostEntity>) post: PostEntity) {
    const { strategy } = this.request.state;
    if (['authorized', 'inner'].includes(strategy)) {
      const data = await this.service.softRemove(post);
      return new ResponsePostDTO(data);
    }
    throw new ForbiddenException();
  }
}
