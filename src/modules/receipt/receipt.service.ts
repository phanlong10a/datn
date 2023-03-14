import { BadRequestException, Injectable } from '@nestjs/common';
import { receipt_transaction } from '@prisma/client';
import { BaseOutput } from 'src/helpers/base-output';
import { PrismaService } from 'src/share_modules/prisma.service';

@Injectable()
export class ReceiptService {
  constructor(private readonly prisma: PrismaService) {}

  async createReceipt(patientId: string) {
    try {
      const response = await this.prisma.receipt_transaction.create({
        data: {
          patientId,
        },
      });
      return new BaseOutput<receipt_transaction>({ ...response }, '');
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
