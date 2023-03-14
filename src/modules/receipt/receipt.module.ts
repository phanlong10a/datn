import { Module } from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { ReceiptController } from './receipt.controller';

@Module({
  controllers: [ReceiptController],
  providers: [ReceiptService]
})
export class ReceiptModule {}
