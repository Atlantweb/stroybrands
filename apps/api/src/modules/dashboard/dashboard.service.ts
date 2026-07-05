import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [shops, products, activeProducts, promocodes, reviews, clicksToday] = await Promise.all([
      this.prisma.shop.count(),
      this.prisma.product.count(),
      this.prisma.product.count({ where: { status: 'active' } }),
      this.prisma.promocode.count({ where: { status: 'active', endDate: { gte: new Date() } } }),
      this.prisma.review.count({ where: { status: 'pending' } }),
      this.prisma.clickLog.count({
        where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
      }),
    ]);

    return { shops, products, activeProducts, promocodes, pendingReviews: reviews, clicksToday };
  }
}
