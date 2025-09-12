import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { version, name } from '../../../../package.json';

@Exclude()
export class StatusDto {
  @ApiProperty({ description: 'Application name', example: name })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Application version',
    example: version,
    type: 'string',
  })
  @Expose()
  version: string;

  constructor() {
    Object.assign(this, { version, name });
  }
}
