import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';

import { AuthService } from '@Modules/blog/auth/service/auth.service';

@Injectable()
export class UserAuthorizeGuard implements CanActivate {
  constructor(
    protected readonly reflector: Reflector,
    protected readonly authService: AuthService,
    protected readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    try {
      const userPayload = await this.authService.authenticateToken(
        request.headers,
        'user',
      );

      request.state = {
        strategy: 'authorized',
        ...userPayload,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid user token');
    }
  }
}
