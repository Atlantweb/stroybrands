import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { ClickLogsService } from './click-logs.service';

@Controller('click-logs')
export class ClickLogsController {
  constructor(private readonly service: ClickLogsService) {}

  @Post()
  log(@Body('productId') productId: string, @Body('shopId') shopId: string, @Body('subid') subid?: string) {
    return this.service.log(productId, shopId, subid);
  }

  @Get('stats')
  getStats(@Query('shopId') shopId?: string) {
    return this.service.getStats(shopId);
  }

  @Get('recent')
  getRecent(@Query('limit') limit?: string) {
    return this.service.getRecent(limit ? Number(limit) : 50);
  }
}
