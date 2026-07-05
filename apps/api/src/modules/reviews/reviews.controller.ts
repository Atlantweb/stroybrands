import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly service: ReviewsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Req() req: Request, @Body('productId') productId: string, @Body('rating') rating: number, @Body('text') text: string) {
    const user = (req as any).user as { sub: string };
    return this.service.create(productId, user.sub, rating, text);
  }

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.service.findByProduct(productId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('admin')
  findAll(@Req() req: Request) {
    return this.service.findAll({});
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/moderate')
  moderate(@Param('id') id: string, @Body('status') status: 'approved' | 'rejected') {
    return this.service.moderate(id, status);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
