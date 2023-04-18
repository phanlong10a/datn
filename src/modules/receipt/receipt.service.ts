import { BadRequestException, Injectable } from '@nestjs/common';
import { receipt_transaction, medicine } from '@prisma/client';
import { BaseOutput } from 'src/helpers/base-output';
import { BaseSearchInput } from 'src/helpers/base-search.input';
import { PrismaService } from 'src/share_modules/prisma.service';
import { CreatePrescriptionDto1 } from './dto/receipt.dto';
import * as dayjs from 'dayjs';

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
  async createReceiptTransaction(input: CreatePrescriptionDto1, id: string) {
    const transaction = await this.prisma.receipt_transaction.create({
      data: {
        patientId: input.patientId,
        measure_fee: +input.measure_fee,
        diagnose: input.diagnose,
        description: input.description,
        created_by_id: id,
      },
    });

    const prescription_transation =
      await this.prisma.prescription_transation.create({
        data: {
          receipt_transactionId: transaction.id,
          total_count: +input.total_count,
        },
      });

    const input_medicine = input.medicine.map((item) => ({
      medicineId: item.medicine,
      amount_dosage: item.amount_dosage,
      prescription_transationId: prescription_transation.id,
    }));
    await this.prisma.prescription_medicine.createMany({
      data: input_medicine,
      skipDuplicates: true,
    });

    const response = await this.prisma.receipt_transaction.findFirst({
      where: {
        id: transaction.id,
      },
      include: {
        patient: true,
        prescription_transation: {
          include: {
            prescription_medicine: true,
          },
        },
      },
    });
    return new BaseOutput<receipt_transaction>({ ...response }, '');
  }

  async search(id: string) {
    const response = await this.prisma.receipt_transaction.findFirst({
      where: { id: id },
      include: {
        patient: true,
        created_by: true,
        updated_by: true,
        prescription_transation: {
          include: {
            prescription_medicine: {
              include: {
                medicine: true,
              },
            },
          },
        },
      },
    });
    return new BaseOutput<receipt_transaction>(
      { ...response },
      'Thanh toán thành công',
    );
  }
  async confirm(id: string, idUser: string) {
    console.log(
      '🚀 ~ file: receipt.service.ts:93 ~ ReceiptService ~ confirm ~ id:',
      id,
    );
    const response = await this.prisma.receipt_transaction.update({
      where: { id },
      data: {
        paidStatus: true,
        updated_by_id: idUser,
      },
      include: {
        patient: true,
        created_by: true,
        updated_by: true,
        prescription_transation: {
          include: {
            prescription_medicine: {
              include: {
                medicine: true,
              },
            },
          },
        },
      },
    });
    return response;
  }

  async searchList(input: BaseSearchInput) {
    const response = await this.prisma.receipt_transaction.findMany({
      include: {
        patient: true,
        created_by: true,
        updated_by: true,
        prescription_transation: {
          include: {
            prescription_medicine: {
              include: {
                medicine: true,
              },
            },
          },
        },
      },
    });

    return {
      data: response.map((item1) => {
        const totalFee =
          item1.prescription_transation.prescription_medicine.reduce(
            (current, item) => {
              const totalFeeMedicine =
                item.medicine.price_per_unit * item.amount_dosage;
              return current + totalFeeMedicine;
            },
            0,
          ) *
            item1.prescription_transation.total_count +
          item1.measure_fee;
        return {
          ...item1,
          totalFee,
        };
      }),
      total: response.length,
    };
  }

  async getRevenue({ month }: { month: string }) {
    const response = await this.prisma.receipt_transaction.findMany({
      where: {
        created_at: {
          gt: dayjs(month).add(-1, 'M').toDate(),
          lte: dayjs(month).add(1, 'M').toDate(),
        },
      },
      include: {
        patient: true,
        created_by: true,
        updated_by: true,
        prescription_transation: {
          include: {
            prescription_medicine: {
              include: {
                medicine: true,
              },
            },
          },
        },
      },
    });
    return {
      data: response.map((item1) => {
        const { created_at, measure_fee, created_by } = item1;
        const totalFee =
          item1.prescription_transation.prescription_medicine.reduce(
            (current, item) => {
              const totalFeeMedicine =
                item.medicine.price_per_unit * item.amount_dosage;
              return current + totalFeeMedicine;
            },
            0,
          ) * item1.prescription_transation.total_count;
        return {
          created_at,
          measure_fee,
          created_by,
          totalFee,
        };
      }),
      total: response.length,
    };
  }
}
