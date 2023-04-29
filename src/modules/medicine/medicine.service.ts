import { BadRequestException, Injectable } from '@nestjs/common';
import { medicine } from '@prisma/client';
import { BaseOutput } from 'src/helpers/base-output';
import { BaseSearchInput } from 'src/helpers/base-search.input';
import { PrismaService } from '../../share_modules/prisma.service';
import { medicineDto } from './dto/medicine.dto';

@Injectable()
export class MedicineService {
  constructor(private prisma: PrismaService) {}

  async createMedicine(input: medicineDto) {
    console.log(
      '🚀 ~ file: medicine.service.ts:13 ~ MedicineService ~ createMedicine ~ input:',
      input,
    );
    try {
      const response = await this.prisma.medicine.create({
        data: input,
      });
      console.log(
        '🚀 ~ file: medicine.service.ts:17 ~ MedicineService ~ createMedicine ~ response:',
        response,
      );
      return new BaseOutput<medicine>(response, 'Tạo thuốc thành công');
    } catch (error) {
      console.log(
        '🚀 ~ file: medicine.service.ts:23 ~ MedicineService ~ createMedicine ~ error:',
        error,
      );
      return error;
    }
  }
  async updateMedicine(input: medicineDto, id: string) {
    console.log(
      '🚀 ~ file: medicine.service.ts:35 ~ MedicineService ~ updateMedicine ~ input:',
      input,
    );
    try {
      const response = await this.prisma.medicine.update({
        where: {
          id: id,
        },
        data: input,
      });
      return new BaseOutput<medicine>(response, 'Cập nhật thành công');
    } catch (error) {
      return error;
    }
  }

  async getListMedicine(input: BaseSearchInput) {
    try {
      const response = await this.prisma.medicine.findMany({
        where: {
          name: {
            contains: input.search_text,
            mode: 'insensitive',
          },
        },
      });
      return {
        data: response,
        total: response.length,
      };
    } catch (error) {}
  }

  async getMedicine(id: string) {
    try {
      const response = await this.prisma.medicine.findFirstOrThrow({
        where: {
          id,
        },
      });
      return new BaseOutput<medicine>(response, '');
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteMedicine(id: string) {
    try {
      const response = await this.prisma.medicine.delete({
        where: {
          id,
        },
      });
      return new BaseOutput<medicine>(response, 'Xoá thành công');
    } catch (error) {}
  }
}
