import { Controller, Post } from '@nestjs/common';
import { Args } from '@nestjs/graphql';
import { ReceiptService } from './receipt.service';

@Controller('/receipt')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Post('/create/:patientId')
  async createReceipt(@Args('patientId') patientId: string) {
    return await this.receiptService.createReceipt(patientId);
  }
}
