import { ApiResponseProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { version, name } from '../../../../package.json';

@Exclude()
export class StatusDto {
  @ApiResponseProperty()
  @Expose()
  name: string;

  @ApiResponseProperty({
    type: 'string',
  })
  @Expose()
  version: string;

  constructor() {
    Object.assign(this, { version, name });
  }
}
