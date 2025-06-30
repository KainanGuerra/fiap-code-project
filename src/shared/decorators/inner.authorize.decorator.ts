import { applyDecorators, SetMetadata } from '@nestjs/common';

export const IS_INNER_KEY = 'isInnerAuth';

export function InnerAuthorize() {
  return applyDecorators(SetMetadata(IS_INNER_KEY, true));
}
