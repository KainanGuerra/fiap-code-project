import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToInstance } from 'class-transformer';
import { Like, Repository } from 'typeorm';

import { UserEntity } from '@Modules/blog/auth/user.entity';

import { GetPostsDTO } from '../dto/get-posts-dto';
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

  update(payload: Partial<PostEntity>, post: PostEntity) {
    return this.repo.save({ ...post, ...payload });
  }

  softRemove(post: PostEntity): Promise<PostEntity> {
    return this.repo.softRemove(post);
  }

  async find(
    paginate: { limit: number; page: number },
    user?: UserEntity,
    query?: GetPostsDTO,
  ) {
    const { limit, page } = paginate;
    const offset = (page - 1) * limit;
    let term: string | undefined;
    if (instanceToInstance(query)?.term) {
      term = instanceToInstance(query)?.term;
    }

    const [posts, count] = await this.repo.findAndCount({
      where: [
        {
          ...(term ? { title: Like(term) } : {}),
        },
        {
          ...(term ? { content: Like(term) } : {}),
        },
      ],
      take: limit,
      skip: offset,
    });

    return { page, limit, posts, totalPosts: count };
  }

  findOne(id: string) {
    return this.repo.findOneByOrFail({ id });
  }
}
