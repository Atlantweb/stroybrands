import { Module } from '@nestjs/common';
import { ClickLogsController } from './click-logs.controller';
import { ClickLogsService } from './click-logs.service';

@Module({
  controllers: [ClickLogsController],
  providers: [ClickLogsService],
  exports: [ClickLogsService],
})
export class ClickLogsModule {}
