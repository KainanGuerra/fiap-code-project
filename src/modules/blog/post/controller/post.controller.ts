import { Controller, Get, Inject, Patch, Post } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { FastifyRequest } from 'fastify';

import { PostService } from '../services/post.service';

@Controller('posts')
export class PublicationController {
  constructor(
    private readonly service: PostService,
    @Inject(REQUEST) private request: FastifyRequest,
  ) {}

  @Get()
  find() {
    return 'test';
  }

  @Get(':id')
  findOne() {}

  @Post()
  create() {}

  @Patch()
  patch() {}
}
