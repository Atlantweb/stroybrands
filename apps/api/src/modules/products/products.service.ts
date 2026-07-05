import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import slugify from 'slugify';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    categoryId?: string;
    shopId?: string;
    search?: string;
    hasPromocode?: boolean;
    isNew?: boolean;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = { status: 'active' };

    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.shopId) where.shopId = query.shopId;
    if (query.isNew) where.isNew = true;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search } },
        { brand: { contains: query.search } },
        { article: { contains: query.search } },
      ];
    }
    if (query.hasPromocode) {
      where.promocodes = { some: { status: 'active', endDate: { gte: new Date() } } };
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    if (query.sort === 'price') orderBy.price = query.order || 'asc';
    else if (query.sort === 'createdAt') orderBy.createdAt = query.order || 'desc';
    else orderBy.createdAt = 'desc';

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: { shop: true, category: true, parameters: true },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        shop: true,
        category: true,
        parameters: true,
        promocodes: { where: { status: 'active', endDate: { gte: new Date() } } },
        reviews: { where: { status: 'approved' } },
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findFirst({
      where: { slug, status: 'active' },
      include: {
        shop: true,
        category: true,
        parameters: true,
        promocodes: { where: { status: 'active', endDate: { gte: new Date() } } },
        reviews: { where: { status: 'approved' } },
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findRelated(productId: string, categoryId?: string, limit = 8) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) return [];

    return this.prisma.product.findMany({
      where: {
        categoryId: categoryId || product.categoryId || undefined,
        id: { not: productId },
        status: 'active',
      },
      take: limit,
      include: { shop: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: 'active' | 'inactive') {
    await this.findById(id);
    return this.prisma.product.update({ where: { id }, data: { status } });
  }

  async bulkUpdateStatus(ids: string[], status: 'active' | 'inactive') {
    return this.prisma.product.updateMany({
      where: { id: { in: ids } },
      data: { status },
    });
  }
}
