import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';

import { StateRole } from '@App/@types/FastifyRequest';
import { IS_INNER_KEY } from '@Shared/decorators';

import { validateInnerAuth } from './utils';

@Injectable()
export class InnerAuthorizeGuard implements CanActivate {
  constructor(
    protected readonly configService: ConfigService,
    protected readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    const isInner = !!this.reflector.getAllAndOverride(IS_INNER_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!isInner) {
      return true;
    }

    const innerAuthToken = this.configService.getOrThrow<string>('INNER_AUTH');

    if (!validateInnerAuth(request, innerAuthToken)) {
      throw new UnauthorizedException('Invalid inner authorization token');
    }

    request.state = {
      strategy: 'inner',
      role: StateRole.INTERNAL,
    };

    return true;
  }
}
