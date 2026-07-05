import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { RedisModule } from './common/redis/redis.module';
import { ShopsModule } from './modules/shops/shops.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { PromocodesModule } from './modules/promocodes/promocodes.module';
import { ImportsModule } from './modules/imports/imports.module';
import { AuthModule } from './modules/auth/auth.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { ClickLogsModule } from './modules/click-logs/click-logs.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    ShopsModule,
    CategoriesModule,
    ProductsModule,
    PromocodesModule,
    ImportsModule,
    AuthModule,
    ReviewsModule,
    ClickLogsModule,
    DashboardModule,
  ],
})
export class AppModule {}
