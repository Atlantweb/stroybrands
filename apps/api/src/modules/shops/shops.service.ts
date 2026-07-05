import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';

@Injectable()
export class ShopsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateShopDto) {
    return this.prisma.shop.create({ data: dto });
  }

  async findAll() {
    return this.prisma.shop.findMany({ orderBy: { name: 'asc' } });
  }

  async findById(id: string) {
    const shop = await this.prisma.shop.findUnique({ where: { id } });
    if (!shop) throw new NotFoundException('Shop not found');
    return shop;
  }

  async findBySlug(slug: string) {
    const shop = await this.prisma.shop.findUnique({ where: { slug } });
    if (!shop) throw new NotFoundException('Shop not found');
    return shop;
  }

  async update(id: string, dto: UpdateShopDto) {
    await this.findById(id);
    return this.prisma.shop.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.shop.delete({ where: { id } });
  }
}
