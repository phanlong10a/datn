import { BadRequestException, Injectable } from '@nestjs/common';
import { prescription_medicine, prescription_transation } from '@prisma/client';
import { BaseOutput } from 'src/helpers/base-output';
import { BaseSearchInput } from 'src/helpers/base-search.input';
import { PrismaService } from 'src/share_modules/prisma.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';

@Injectable()
export class PrescriptionService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createPrescriptionDto: CreatePrescriptionDto) {
    try {
      const response = await this.prismaService.prescription_transation.create({
        data: {
          name: createPrescriptionDto.name,
          disease: createPrescriptionDto.disease,
          receipt_transactionId: createPrescriptionDto.receiptId,
        },
        include: {
          prescription_medicine: true,
        },
      });

      const listPresMedic = await this.prismaService.$transaction(
        createPrescriptionDto.medicine.map((item) => {
          return this.prismaService.prescription_medicine.create({
            data: {
              medicineId: item.id,
              prescription_transationId: response.id,
              amount_dosage: item.amount_dosage,
            },
          });
        }),
      );
      return new BaseOutput<
        prescription_transation & {
          prescription_medicine: prescription_medicine[];
        }
      >({ ...response, prescription_medicine: listPresMedic }, '');
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findAll(input: BaseSearchInput) {
    try {
      const data = await this.prismaService.prescription_transation.findMany({
        where: {
          name: {
            contains: input.search_text,
            mode: 'insensitive',
          },
        },
        include: {
          prescription_medicine: {
            include: {
              medicine: true,
            },
          },
          receipt_transaction: true,
        },
      });
      return new BaseOutput<any[]>(data, '');
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findOne(id: string) {
    try {
      const data =
        await this.prismaService.prescription_transation.findFirstOrThrow({
          where: { id },
          include: {
            prescription_medicine: {
              include: {
                medicine: true,
              },
            },
            receipt_transaction: true,
          },
        });
      return new BaseOutput<any>(data, '');
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async update(id: string, updatePrescriptionDto: UpdatePrescriptionDto) {
    try {
      const data =
        await this.prismaService.prescription_transation.findFirstOrThrow({
          where: { id },
          include: {
            receipt_transaction: true,
          },
        });

      if (data.receipt_transaction?.isComplete) {
        throw new Error('Đơn thuốc đã xuất hoá đơn không thể sửa');
      }

      const response = await this.prismaService.prescription_transation.update({
        where: { id },
        data: updatePrescriptionDto,
      });
      return new BaseOutput<any>(response, '');
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async remove(id: string) {
    try {
      const data = await this.prismaService.prescription_transation.delete({
        where: { id },
      });
      return new BaseOutput<any>(data, '');
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
