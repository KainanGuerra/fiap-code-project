import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '@Modules/blog/auth/user.entity';

import { PostEntity } from '../post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly repo: Repository<PostEntity>,
    private readonly configService: ConfigService,
  ) {}

  create(payload: Partial<PostEntity>, user: UserEntity) {
    return this.repo.save({ ...payload, user });
  }

  async find(user?: UserEntity) {
    const limit = 15;
    const page = 1;
    const offset = (page - 1) * limit;

    const [posts, count] = await this.repo.findAndCount({
      where: user ? { user: { id: user.id } } : {},
      take: limit,
      skip: offset,
    });

    return { page, limit, posts, totalPosts: count };
  }

  findOne() {}

  patch() {}
}
