import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Inject,
  Patch,
  Post,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { FastifyRequest } from 'fastify';

import { InnerAuthorize, UserAuthorize } from '@Shared/decorators';

import { CreatePostDTO } from '../dto/create-post.dto';
import { ResponseManyPostsDTO } from '../dto/response-many-posts.dto';
import { ResponsePostDTO } from '../dto/response-post.dto';
import { PostService } from '../services/post.service';

@InnerAuthorize()
@UserAuthorize()
@Controller('posts')
export class PublicationController {
  constructor(
    private readonly service: PostService,
    @Inject(REQUEST) private request: FastifyRequest,
  ) {}

  @Get()
  async find() {
    const { strategy } = this.request.state;
    if (['authorized', 'inner'].includes(strategy)) {
      const user =
        'authorized' === strategy ? this.request.state.user : undefined;
      return new ResponseManyPostsDTO(await this.service.find(user));
    }
    throw new ForbiddenException();
  }

  @Get(':id')
  findOne() {}

  @Post()
  async create(@Body() payload: CreatePostDTO) {
    const { strategy } = this.request.state;

    if ('authorized' === strategy) {
      const data = await this.service.create(
        payload,
        this.request?.state?.user,
      );
      return new ResponsePostDTO(data);
    }
    throw new ForbiddenException();
  }

  @Patch()
  patch() {}
}
