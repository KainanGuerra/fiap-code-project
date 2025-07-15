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
import { AuthRoles } from '@Shared/constants/auth.roles.constant';
import { IS_USER_KEY } from '@Shared/decorators';

import { PublicAuthorizeGuard } from './public.authorize.guard';

@Injectable()
export class UserAuthorizeGuard
  extends PublicAuthorizeGuard
  implements CanActivate
{
  constructor(
    protected readonly reflector: Reflector,
    protected readonly authService: AuthService,
    protected readonly configService: ConfigService,
  ) {
    super(reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    const isUser = !!this.reflector.getAllAndOverride(IS_USER_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!isUser || !('authorization' in request.headers)) {
      return super.canActivate(context);
    }

    try {
      const data = await this.authService.authenticateToken(request.headers);
      const role = data.user.role;
      request.state = {
        role:
          role === AuthRoles.professor
            ? StateRole.PROFESSOR
            : StateRole.STUDENT,
        strategy: 'authorized',
        ...data,
      };

      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid user token');
    }
  }
}
