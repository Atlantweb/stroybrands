import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Post()
  create(@Body('name') name: string, @Body('parentId') parentId?: string) {
    return this.service.create(name, parentId);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('tree')
  getTree() {
    return this.service.getTree();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: { name?: string; parentId?: string | null; sortOrder?: number }) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Get('mappings/:shopId')
  getMappings(@Param('shopId') shopId: string) {
    return this.service.getMappings(shopId);
  }

  @Post('mappings/:shopId')
  createMapping(
    @Param('shopId') shopId: string,
    @Body('externalCategoryId') externalCategoryId: string,
    @Body('internalCategoryId') internalCategoryId: string,
  ) {
    return this.service.createMapping(shopId, externalCategoryId, internalCategoryId);
  }

  @Delete('mappings/:shopId/:externalCategoryId')
  deleteMapping(@Param('shopId') shopId: string, @Param('externalCategoryId') externalCategoryId: string) {
    return this.service.deleteMapping(shopId, externalCategoryId);
  }
}
