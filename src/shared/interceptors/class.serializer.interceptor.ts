import {
  CallHandler,
  ClassSerializerContextOptions,
  ClassSerializerInterceptor,
  ExecutionContext,
  Injectable,
  PlainLiteralObject,
  Scope,
} from '@nestjs/common';
import { ClassSerializerInterceptorOptions } from '@nestjs/common/serializer/class-serializer.interceptor';
import { FastifyRequest } from 'fastify';

import { StateRole } from '@App/@types/FastifyRequest';

@Injectable({
  scope: Scope.REQUEST,
})
export class ClassSerializerGuardInterceptor extends ClassSerializerInterceptor {
  protected role: StateRole;

  constructor(
    reflector: any,
    defaultOptions?: ClassSerializerInterceptorOptions,
  ) {
    super(reflector, defaultOptions);
  }

  intercept(context: ExecutionContext, next: CallHandler) {
    return super.intercept(context, next);
  }

  /**
   * Request
   * @param response
   * @param options
   */
  serialize(
    response: PlainLiteralObject | Array<PlainLiteralObject>,
    options: ClassSerializerContextOptions,
  ): PlainLiteralObject | Array<PlainLiteralObject> {
    if (this.role) {
      options.groups = [this.role];
    }
    return super.serialize(response, options);
  }

  /**
   * Response
   * @param plainOrClass
   * @param options
   */
  transformToPlain(
    plainOrClass: unknown,
    options: ClassSerializerContextOptions,
  ): PlainLiteralObject {
    if (this.role) {
      options.groups = [this.role];
    }
    return super.transformToPlain(plainOrClass, options);
  }

  protected getContextOptions(
    context: ExecutionContext,
  ): ClassSerializerContextOptions | undefined {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    if (request.state?.role) {
      this.role = request.state.role;
    }

    return super.getContextOptions(context);
  }
}
