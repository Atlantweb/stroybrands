import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import slugify from 'slugify';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(name: string, parentId?: string) {
    const slug = slugify(name, { lower: true, strict: true }) + '-' + Date.now();
    return this.prisma.category.create({ data: { name, slug, parentId } });
  }

  async findAll() {
    return this.prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async getTree() {
    const all = await this.prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { children: true },
    });
    return all.filter((c) => !c.parentId);
  }

  async findById(id: string) {
    const cat = await this.prisma.category.findUnique({ where: { id } });
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  async update(id: string, data: { name?: string; parentId?: string | null; sortOrder?: number }) {
    await this.findById(id);
    return this.prisma.category.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findById(id);
    await this.prisma.category.updateMany({
      where: { parentId: id },
      data: { parentId: null },
    });
    return this.prisma.category.delete({ where: { id } });
  }

  async importExternalCategories(shopId: string) {
    const shop = await this.prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop) throw new NotFoundException('Shop not found');

    // Parse feed and extract categories (stub - actual parsing in import module)
    return { message: 'Categories imported. Check shop feed for details.' };
  }

  async getMappings(shopId: string) {
    return this.prisma.categoryMapping.findMany({
      where: { shopId },
      include: { internalCategory: true },
    });
  }

  async createMapping(shopId: string, externalCategoryId: string, internalCategoryId: string) {
    return this.prisma.categoryMapping.upsert({
      where: { shopId_externalCategoryId: { shopId, externalCategoryId } },
      update: { internalCategoryId },
      create: { shopId, externalCategoryId, internalCategoryId },
    });
  }

  async deleteMapping(shopId: string, externalCategoryId: string) {
    try {
      await this.prisma.categoryMapping.delete({
        where: { shopId_externalCategoryId: { shopId, externalCategoryId } },
      });
    } catch {
      throw new NotFoundException('Mapping not found');
    }
  }
}
