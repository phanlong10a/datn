import { BadRequestException, Injectable } from '@nestjs/common';
import { prescription, prescription_medicine } from '@prisma/client';
import { BaseOutput } from 'src/helpers/base-output';
import { PrismaService } from 'src/share_modules/prisma.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';

@Injectable()
export class PrescriptionService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createPrescriptionDto: CreatePrescriptionDto) {
    try {
      const response = await this.prismaService.prescription.create({
        data: {
          name: createPrescriptionDto.name,
          disease: createPrescriptionDto.disease,
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
              prescriptionId: response.id,
              amount_dosage: item.amount_dosage,
            },
          });
        }),
      );
      return new BaseOutput<
        prescription & {
          prescription_medicine: prescription_medicine[];
        }
      >({ ...response, prescription_medicine: listPresMedic }, '');
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findAll() {
    try {
      const data = await this.prismaService.prescription.findMany({
        include: {
          prescription_medicine: {
            include: {
              medicine: true,
            },
          },
          prescription_transation: true,
        },
      });
      return new BaseOutput<any[]>(data, '');
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.prismaService.prescription.findFirstOrThrow({
        where: { id },
        include: {
          prescription_medicine: {
            include: {
              medicine: true,
            },
          },
          prescription_transation: true,
        },
      });
      return new BaseOutput<any>(data, '');
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  update(id: string, updatePrescriptionDto: UpdatePrescriptionDto) {
    return `This action updates a #${id} prescription`;
  }

  async remove(id: string) {
    try {
      const data = await this.prismaService.prescription.delete({
        where: { id },
      });
      return new BaseOutput<any>(data, '');
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
