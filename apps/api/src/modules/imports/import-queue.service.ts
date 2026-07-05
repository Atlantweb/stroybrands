import { Injectable, Logger } from '@nestjs/common';
import { FeedImportProcessor } from './processors/feed-import.processor';

@Injectable()
export class ImportQueueService {
  private readonly logger = new Logger(ImportQueueService.name);

  constructor(private readonly processor: FeedImportProcessor) {}

  async enqueue(shopId: string) {
    this.logger.log(`Enqueuing import for shop ${shopId} (in-memory mode)`);
    this.processor.process({ data: { shopId } } as any).catch((err) => {
      this.logger.error(`Import failed for shop ${shopId}: ${err.message}`);
    });
    return { jobId: 'in-memory' };
  }
}
