import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { StatusDto } from '@App/modules/status/dto/status.dto';
import { PublicAuthorize } from '@Shared/decorators';

@Controller({
  path: 'status',
  version: VERSION_NEUTRAL,
})
@PublicAuthorize()
export class StatusController {
  @ApiResponse({
    status: 200,
    description: 'Name and version of the application',
  })
  @Get()
  check(): StatusDto {
    return new StatusDto();
  }
}
