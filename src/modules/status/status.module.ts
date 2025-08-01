import { Module } from '@nestjs/common';

import { StatusController } from '@Modules/status/status.controller';

@Module({
  controllers: [StatusController],
})
export class StatusModule {}
