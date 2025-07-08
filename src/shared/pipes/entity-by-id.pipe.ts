import {
  ArgumentMetadata,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { DataSource } from 'typeorm';

const pattern = /^([a-z]+_)?[0-9a-hjkmnp-tv-z]{26}$/;

export function isULID(value: string): boolean {
  return pattern.test(value);
}

@Injectable()
export class EntityByIdPipe<T> implements PipeTransform<string, Promise<T>> {
  constructor(
    private readonly dataSource?: DataSource,
    @Inject(REQUEST) private request?: FastifyRequest,
  ) {}

  async transform(value: string, metadata: ArgumentMetadata): Promise<T> {
    if (!isULID(value)) {
      throw new NotAcceptableException(`Id ${value} is invalid.`);
    }

    if (!metadata.metatype) throw new Error('meta type is required');

    const entity = (await this.dataSource
      ?.getRepository(metadata.metatype)
      .findOne({
        where: {
          id: value,
        },
        loadEagerRelations: true,
      })) as T;

    if (!entity) {
      throw new NotFoundException(
        `Could not find any entity with id: ${value}`,
      );
    }

    return entity;
  }
}
