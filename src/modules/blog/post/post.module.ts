// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PublicationController } from './controller/post.controller';
import { PostEntity } from './post.entity';
import { PostService } from './services/post.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity])],
  providers: [PostService],
  controllers: [PublicationController],
  exports: [PostService],
})
export class PostModule {}
