import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { PromocodesService } from './promocodes.service';
import { Prisma } from '@prisma/client';

@Controller('promocodes')
export class PromocodesController {
  constructor(private readonly service: PromocodesService) {}

  @Post()
  create(@Body() data: Prisma.PromocodeCreateInput) {
    return this.service.create(data);
  }

  @Get()
  findAll(@Query('shopId') shopId?: string) {
    return this.service.findAll({ shopId });
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.PromocodeUpdateInput) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Get('product/:productId')
  getActiveForProduct(@Param('productId') productId: string) {
    return this.service.getActiveForProduct(productId);
  }

  @Get('shop/:shopId')
  getActiveForShop(@Param('shopId') shopId: string) {
    return this.service.getActiveForShop(shopId);
  }
}
