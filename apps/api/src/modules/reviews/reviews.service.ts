import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(productId: string, userId: string, rating: number, text: string) {
    return this.prisma.review.create({
      data: { productId, userId, rating, text, status: 'pending' },
    });
  }

  async findByProduct(productId: string) {
    return this.prisma.review.findMany({
      where: { productId, status: 'approved' },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(query: { status?: string }) {
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    return this.prisma.review.findMany({
      where,
      include: { product: true, user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async moderate(id: string, status: 'approved' | 'rejected') {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    return this.prisma.review.update({ where: { id }, data: { status } });
  }

  async remove(id: string) {
    await this.prisma.review.findUniqueOrThrow({ where: { id } });
    return this.prisma.review.delete({ where: { id } });
  }
}
