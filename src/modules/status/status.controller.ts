import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

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
    type: StatusDto,
  })
  @ApiOperation({ summary: 'Get application status' })
  @Get()
  check(): StatusDto {
    console.debug('Status endpoint: ', new StatusDto());
    return new StatusDto();
  }
}
