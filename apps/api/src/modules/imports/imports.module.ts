import { Module } from '@nestjs/common';
import { ImportsController } from './imports.controller';
import { ImportQueueService } from './import-queue.service';
import { FeedParserService } from './feed-parser.service';
import { FeedImportProcessor } from './processors/feed-import.processor';

@Module({
  controllers: [ImportsController],
  providers: [ImportQueueService, FeedParserService, FeedImportProcessor],
  exports: [ImportQueueService, FeedParserService],
})
export class ImportsModule {}
