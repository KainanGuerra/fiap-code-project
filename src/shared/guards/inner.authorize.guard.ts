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
import { AuthService } from '@Modules/blog/auth/service/auth.service';
import { IS_INNER_KEY } from '@Shared/decorators';

import { UserAuthorizeGuard } from './user.authorize.guard';
import { validateInnerAuth } from './utils';

@Injectable()
export class InnerAuthorizeGuard
  extends UserAuthorizeGuard
  implements CanActivate
{
  constructor(
    protected readonly reflector: Reflector,
    protected readonly authService: AuthService,
    protected readonly configService: ConfigService,
  ) {
    super(reflector, authService, configService);
  }

  canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    const isInner = !!this.reflector.getAllAndOverride(IS_INNER_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const innerAuthTokenFromRequest = request.headers[
      'inner-authorization'
    ] as string;

    if (!isInner || !innerAuthTokenFromRequest) {
      return super.canActivate(context);
    }

    const innerAuthToken = this.configService.getOrThrow<string>('INNER_AUTH');

    if (!validateInnerAuth(request, innerAuthToken)) {
      throw new UnauthorizedException('Invalid inner authorization token');
    }

    request.state = {
      strategy: 'inner',
      role: StateRole.INTERNAL,
    };

    return Promise.resolve(true);
  }
}
