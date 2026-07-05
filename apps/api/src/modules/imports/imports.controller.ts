import { Controller, Post, Get, Param, Query } from '@nestjs/common';
import { ImportQueueService } from './import-queue.service';
import { PrismaService } from '../../common/prisma/prisma.service';

@Controller('imports')
export class ImportsController {
  constructor(
    private readonly queue: ImportQueueService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('run/:shopId')
  runImport(@Param('shopId') shopId: string) {
    return this.queue.enqueue(shopId);
  }

  @Get('logs')
  async getLogs(@Query('shopId') shopId?: string) {
    const where: Record<string, unknown> = {};
    if (shopId) where.shopId = shopId;
    return this.prisma.importLog.findMany({
      where,
      orderBy: { startedAt: 'desc' },
      take: 50,
      include: { shop: { select: { name: true } } },
    });
  }

  @Get('logs/:id')
  async getLogById(@Param('id') id: string) {
    return this.prisma.importLog.findUnique({ where: { id } });
  }
}
