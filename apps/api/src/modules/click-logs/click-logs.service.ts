import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ClickLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async log(productId: string, shopId: string, subid?: string, ipHash?: string, userAgent?: string) {
    return this.prisma.clickLog.create({
      data: { productId, shopId, subid, ipHash, userAgent },
    });
  }

  async getStats(shopId?: string) {
    const where: Record<string, unknown> = {};
    if (shopId) where.shopId = shopId;

    const [total, byShop] = await Promise.all([
      this.prisma.clickLog.count({ where }),
      this.prisma.clickLog.groupBy({
        by: ['shopId'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 20,
      }),
    ]);

    return { total, byShop };
  }

  async getRecent(limit = 50) {
    return this.prisma.clickLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { product: { select: { name: true } }, shop: { select: { name: true } } },
    });
  }
}
