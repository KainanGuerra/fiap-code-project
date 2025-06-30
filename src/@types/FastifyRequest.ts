import { InternalUserInformation } from '@Shared/interfaces/auth.interface';

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
          user: InternalUserInformation;
          role?: StateRole.PROFESSOR | StateRole.STUDENT;
        };
  }
}
