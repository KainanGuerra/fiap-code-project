import { applyDecorators, SetMetadata } from '@nestjs/common';

export const IS_USER_KEY = 'isUser';

export function UserAuthorize() {
  return applyDecorators(SetMetadata(IS_USER_KEY, true));
}
