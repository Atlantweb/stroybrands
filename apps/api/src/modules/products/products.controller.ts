import { Controller, Get, Patch, Param, Query, Body } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: 'asc' | 'desc',
    @Query('categoryId') categoryId?: string,
    @Query('shopId') shopId?: string,
    @Query('search') search?: string,
    @Query('hasPromocode') hasPromocode?: string,
    @Query('isNew') isNew?: string,
  ) {
    return this.service.findAll({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      sort,
      order,
      categoryId,
      shopId,
      search,
      hasPromocode: hasPromocode === 'true',
      isNew: isNew === 'true',
    });
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }

  @Get(':id/related')
  findRelated(@Param('id') id: string, @Query('categoryId') categoryId?: string) {
    return this.service.findRelated(id, categoryId);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: 'active' | 'inactive') {
    return this.service.updateStatus(id, status);
  }

  @Patch('bulk/status')
  bulkUpdateStatus(
    @Body('ids') ids: string[],
    @Body('status') status: 'active' | 'inactive',
  ) {
    return this.service.bulkUpdateStatus(ids, status);
  }
}
