import { UnauthorizedException } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export const validateInnerAuth = (
  request: FastifyRequest,
  innerAuthToken: string,
) => {
  const innerAuthTokenFromRequest = request.headers[
    'inner-authorization'
  ] as string;
  if (innerAuthTokenFromRequest !== innerAuthToken) {
    throw new UnauthorizedException();
  }
  return true;
};
