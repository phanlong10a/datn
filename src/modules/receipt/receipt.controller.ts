import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { Args } from '@nestjs/graphql';
import { Auth } from 'src/decorators/Authorization';
import { BaseSearchInput } from 'src/helpers/base-search.input';
import { CreatePrescriptionDto1 } from './dto/receipt.dto';
import { ReceiptService } from './receipt.service';
import { CurrentUser } from '../../decorators/Authorization';

@Controller('/receipt')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Post('/create/:patientId')
  async createReceipt(@Args('patientId') patientId: string) {
    return await this.receiptService.createReceipt(patientId);
  }

  @Auth()
  @Post('/create')
  async createReceiptPrescription(
    @Body() input: CreatePrescriptionDto1,
    @CurrentUser('id') id: string,
  ) {
    return await this.receiptService.createReceiptTransaction(input, id);
  }

  @Post('/list')
  async searchList(@Body() input: BaseSearchInput) {
    return await this.receiptService.searchList(input);
  }

  @Get('/:id')
  async search(@Param() id: string) {
    return await this.receiptService.search(id);
  }

  @Post('/confirm/:id')
  async confirm(@Param('id') id: string) {
    return await this.receiptService.confirm(id);
  }
}
