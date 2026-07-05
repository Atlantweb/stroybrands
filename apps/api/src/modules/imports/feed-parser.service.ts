import { Injectable, Logger } from '@nestjs/common';
import { XMLParser } from 'fast-xml-parser';
import { parse } from 'csv-parse/sync';

export interface ParsedOffer {
  offerId: string;
  name: string;
  description?: string;
  price: number;
  oldPrice?: number;
  currencyId: string;
  url: string;
  picture?: string;
  pictures?: string[];
  categoryId?: string;
  vendor?: string;
  vendorCode?: string;
  params?: { name: string; value: string }[];
  promo?: string;
}

export interface FeedParseResult {
  shopName: string;
  shopUrl?: string;
  categories: { id: string; name: string; parentId?: string }[];
  offers: ParsedOffer[];
}

@Injectable()
export class FeedParserService {
  private readonly logger = new Logger(FeedParserService.name);

  async parse(raw: string, format: string): Promise<FeedParseResult> {
    switch (format) {
      case 'yml':
        return this.parseYml(raw);
      case 'csv':
        return this.parseCsv(raw);
      case 'json':
        return this.parseJson(raw);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  private async parseYml(raw: string): Promise<FeedParseResult> {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      isArray: (name) =>
        ['offer', 'category', 'picture', 'param'].includes(name),
    });

    const doc = parser.parse(raw);
    const shop = doc.yml_catalog?.shop || {};
    const offers = shop.offers?.offer || [];
    const categories = shop.categories?.category || [];

    return {
      shopName: shop.name || '',
      shopUrl: shop.url || '',
      categories: categories.map((c: Record<string, unknown>) => ({
        id: String((c as any)['@_id'] || ''),
        name: String(c.name || c['#text'] || ''),
        parentId: (c as any)['@_parentId'] ? String((c as any)['@_parentId']) : undefined,
      })),
      offers: offers.map((o: Record<string, unknown>) => this.normalizeOffer(o)),
    };
  }

  private normalizeOffer(o: Record<string, unknown>): ParsedOffer {
    const params: { name: string; value: string }[] = [];
    const rawParams = o.param;
    if (Array.isArray(rawParams)) {
      for (const p of rawParams) {
        params.push({ name: String((p as any)['@_name'] || ''), value: String(p['#text'] || p.value || '') });
      }
    }

    const pictures: string[] = [];
    const rawPics = o.picture;
    if (Array.isArray(rawPics)) pictures.push(...rawPics.map(String));
    else if (rawPics) pictures.push(String(rawPics));

    return {
      offerId: String((o as any)['@_id'] || ''),
      name: String(o.name || ''),
      description: o.description ? String(o.description) : undefined,
      price: Number(o.price) || 0,
      oldPrice: o.oldprice ? Number(o.oldprice) : undefined,
      currencyId: String(o.currencyId || 'RUB'),
      url: String(o.url || ''),
      picture: pictures[0],
      pictures,
      categoryId: o.categoryId ? String(o.categoryId) : undefined,
      vendor: o.vendor ? String(o.vendor) : undefined,
      vendorCode: o.vendorCode ? String(o.vendorCode) : undefined,
      params: params.length > 0 ? params : undefined,
      promo: o.promo ? String(o.promo) : undefined,
    };
  }

  private async parseCsv(raw: string): Promise<FeedParseResult> {
    const records = parse(raw, { columns: true, skip_empty_lines: true, relax_column_count: true });
    const categories: { id: string; name: string; parentId?: string }[] = [];
    const seenCats = new Set<string>();

    const offers: ParsedOffer[] = records.map((r: Record<string, string>) => {
      const catName = r.category || '';
      if (catName && !seenCats.has(catName)) {
        seenCats.add(catName);
        categories.push({ id: catName, name: catName });
      }
      return {
        offerId: r.id || r.offer_id || '',
        name: r.name || '',
        description: r.description,
        price: Number(r.price) || 0,
        oldPrice: r.oldprice ? Number(r.oldprice) : undefined,
        currencyId: r.currencyId || 'RUB',
        url: r.url || '',
        picture: r.picture || r.image,
        categoryId: catName || undefined,
        vendor: r.vendor || r.brand,
        vendorCode: r.vendorCode || r.article,
        params: r.param ? [{ name: 'param', value: r.param }] : undefined,
        promo: r.promo || r.promocode,
      };
    });

    return { shopName: '', offers, categories };
  }

  private async parseJson(raw: string): Promise<FeedParseResult> {
    const data = JSON.parse(raw);
    const offers: ParsedOffer[] = (data.offers || data.items || data.products || []).map(
      (o: Record<string, unknown>) => ({
        offerId: String((o as any).id || (o as any).offer_id || ''),
        name: String((o as any).name || ''),
        description: (o as any).description,
        price: Number((o as any).price) || 0,
        oldPrice: (o as any).old_price ? Number((o as any).old_price) : undefined,
        currencyId: String((o as any).currency_id || (o as any).currency || 'RUB'),
        url: String((o as any).url || ''),
        picture: (o as any).picture || (o as any).image,
        pictures: (o as any).pictures || (o as any).images,
        categoryId: (o as any).category_id ? String((o as any).category_id) : undefined,
        vendor: (o as any).vendor || (o as any).brand,
        vendorCode: (o as any).vendor_code || (o as any).article,
        params: (o as any).params || (o as any).parameters,
        promo: (o as any).promo || (o as any).promocode,
      }),
    );

    const rawCats = data.categories || [];
    const categories = rawCats.map((c: Record<string, unknown>) => ({
      id: String((c as any).id || ''),
      name: String((c as any).name || ''),
      parentId: (c as any).parent_id ? String((c as any).parent_id) : undefined,
    }));

    return { shopName: data.shop?.name || data.name || '', offers, categories };
  }
}
