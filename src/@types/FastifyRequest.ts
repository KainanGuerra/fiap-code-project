import { UserEntity } from '@Modules/blog/auth/user.entity';

export enum StateRole {
  INTERNAL = 'internal',
  PROFESSOR = 'professor',
  STUDENT = 'student',
}

declare module 'fastify' {
  interface FastifyRequest {
    state:
      | {
          strategy: 'inner' | 'public';
          role: StateRole.INTERNAL;
        }
      | {
          strategy: 'authorized';
          user: UserEntity;
          role: StateRole.PROFESSOR | StateRole.STUDENT;
        };
  }
}
