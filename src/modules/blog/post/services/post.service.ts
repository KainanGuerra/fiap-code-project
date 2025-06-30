import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PostEntity } from '../post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly repo: Repository<PostEntity>,
    private readonly configService: ConfigService,
  ) {}

  create() {}

  find() {}

  findOne() {}

  patch() {}
}
