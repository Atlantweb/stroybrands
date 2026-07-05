import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PromocodesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: { shopId?: string; active?: boolean }) {
    const where: Prisma.PromocodeWhereInput = {};
    if (query.shopId) where.shopId = query.shopId;
    if (query.active !== false) {
      where.status = 'active';
      where.endDate = { gte: new Date() };
    }
    return this.prisma.promocode.findMany({
      where,
      include: { shop: true, product: true },
      orderBy: { endDate: 'asc' },
    });
  }

  async findById(id: string) {
    const promo = await this.prisma.promocode.findUnique({
      where: { id },
      include: { shop: true, product: true },
    });
    if (!promo) throw new NotFoundException('Promocode not found');
    return promo;
  }

  async create(data: Prisma.PromocodeCreateInput) {
    return this.prisma.promocode.create({ data });
  }

  async update(id: string, data: Prisma.PromocodeUpdateInput) {
    await this.findById(id);
    return this.prisma.promocode.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.promocode.delete({ where: { id } });
  }

  async getActiveForProduct(productId: string) {
    return this.prisma.promocode.findMany({
      where: {
        productId,
        status: 'active',
        endDate: { gte: new Date() },
        startDate: { lte: new Date() },
      },
    });
  }

  async getActiveForShop(shopId: string) {
    return this.prisma.promocode.findMany({
      where: {
        shopId,
        status: 'active',
        endDate: { gte: new Date() },
        startDate: { lte: new Date() },
      },
    });
  }

  async deactivateExpired() {
    return this.prisma.promocode.updateMany({
      where: { endDate: { lt: new Date() }, status: 'active' },
      data: { status: 'inactive' },
    });
  }
}
