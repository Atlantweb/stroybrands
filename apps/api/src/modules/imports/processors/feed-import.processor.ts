import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { FeedParserService, ParsedOffer } from '../feed-parser.service';
import slugify from 'slugify';

@Processor('feed-import')
export class FeedImportProcessor extends WorkerHost {
  private readonly logger = new Logger(FeedImportProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly feedParser: FeedParserService,
  ) {
    super();
  }

  async process(job: Job<{ shopId: string }>): Promise<Record<string, number>> {
    const { shopId } = job.data;
    this.logger.log(`Starting import for shop ${shopId}`);

    const shop = await this.prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop) throw new Error(`Shop ${shopId} not found`);

    const importLog = await this.prisma.importLog.create({
      data: { shopId, status: 'running', startedAt: new Date() },
    });

    try {
      const response = await fetch(shop.feedUrl);
      const raw = await response.text();
      const parsed = await this.feedParser.parse(raw, shop.feedFormat);

      const existingMappings = await this.prisma.categoryMapping.findMany({
        where: { shopId },
      });
      const mappingMap = new Map(existingMappings.map((m) => [m.externalCategoryId, m.internalCategoryId]));

      let added = 0;
      let updated = 0;

      await this.prisma.externalCategory.deleteMany({ where: { shopId } });
      if (parsed.categories.length > 0) {
        for (const c of parsed.categories) {
          const exists = await this.prisma.externalCategory.findUnique({
            where: { shopId_externalId: { shopId, externalId: c.id } },
          });
          if (!exists) {
            await this.prisma.externalCategory.create({
              data: { shopId, externalId: c.id, name: c.name, parentExternalId: c.parentId },
            });
          }
        }
      }

      for (const offer of parsed.offers) {
        const internalCategoryId = offer.categoryId ? mappingMap.get(offer.categoryId) : undefined;

        const slug = slugify(offer.name, { lower: true, strict: true }) +
          '-' + offer.offerId;

        const partnerUrl = this.buildPartnerUrl(offer.url, shop.subid ?? undefined);

        const data = {
          shopId,
          offerId: offer.offerId,
          name: offer.name,
          slug,
          description: offer.description,
          brand: offer.vendor,
          article: offer.vendorCode,
          price: offer.price,
          oldPrice: offer.oldPrice,
          currency: offer.currencyId,
          mainImageUrl: offer.picture,
          additionalImages: offer.pictures ? JSON.stringify(offer.pictures) : undefined,
          externalCategoryId: offer.categoryId,
          categoryId: internalCategoryId || undefined,
          url: offer.url,
          partnerUrl,
          isNew: true,
          lastImportedAt: new Date(),
        };

        const existing = await this.prisma.product.findUnique({
          where: { shopId_offerId: { shopId, offerId: offer.offerId } },
        });

        if (existing) {
          await this.prisma.product.update({
            where: { id: existing.id },
            data: { ...data, isNew: false },
          });
          updated++;
        } else {
          await this.prisma.product.create({ data });
          added++;
        }

        if (offer.promo) {
          const existing = await this.prisma.promocode.findFirst({
            where: { shopId, code: offer.promo },
          });
          if (!existing) {
            await this.prisma.promocode.create({
              data: {
                shopId,
                code: offer.promo,
                discountType: 'percent',
                discountValue: 0,
                startDate: new Date(),
                endDate: new Date(Date.now() + 30 * 86400000),
                description: `Промокод для ${offer.name}`,
              },
            });
          }
        }
      }

      const now = new Date();
      const deactivated = await this.prisma.product.updateMany({
        where: {
          shopId,
          lastImportedAt: { lt: new Date(now.getTime() - 86400000) },
          status: 'active',
        },
        data: { status: 'inactive' },
      });

      await this.prisma.importLog.update({
        where: { id: importLog.id },
        data: {
          status: 'completed',
          productsAdded: added,
          productsUpdated: updated,
          productsDeactivated: deactivated.count,
          completedAt: new Date(),
        },
      });

      this.logger.log(`Import completed for shop ${shopId}: +${added} added, ${updated} updated, ${deactivated.count} deactivated`);
      return { added, updated, deactivated: deactivated.count };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      await this.prisma.importLog.update({
        where: { id: importLog.id },
        data: { status: 'failed', errorMessage: message, completedAt: new Date() },
      });
      this.logger.error(`Import failed for shop ${shopId}: ${message}`);
      throw err;
    }
  }

  private buildPartnerUrl(originalUrl: string, subid?: string): string {
    const url = new URL(originalUrl);
    url.searchParams.set('utm_source', 'stroybrands');
    if (subid) url.searchParams.set('subid', subid);
    return url.toString();
  }
}
