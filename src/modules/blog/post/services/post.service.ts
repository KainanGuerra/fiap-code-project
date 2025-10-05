import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToInstance } from 'class-transformer';
import { ILike, Repository } from 'typeorm';

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

    const q = query ? instanceToInstance(query) : {};

    // Relation filter for author
    let joinConditions: Record<string, any> = {};

    if (q.author) {
      joinConditions = {
        user: { email: q.author }
      };
    }

    // Build "OR" where for term search, apply author filter to both
    const where: any[] = [];

    if (q.term) {
      // term exists → OR logic for title/content
      where.push(
        { title: ILike(`%${q.term}%`), ...joinConditions },
        { content: ILike(`%${q.term}%`), ...joinConditions },
      );
    } else if (q.author) {
      // only author filter without term
      where.push({ ...joinConditions });
    } else {
      // no filters → all posts
      where.push({});
    }

    const [posts, count] = await this.repo.findAndCount({
      where,
      take: limit,
      skip: offset,
    });

    return { page, limit, posts, totalPosts: count };
  }

  findOne(id: string) {
    try {
      return this.repo.findOneByOrFail({ id });
    } catch (err) {
      throw new BadRequestException('Entity not accessible or not found');
    }
  }
}
