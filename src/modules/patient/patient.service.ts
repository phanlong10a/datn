import { BadRequestException, Injectable } from '@nestjs/common';
import { patient } from '@prisma/client';
import { BaseOutput } from 'src/helpers/base-output';
import { BaseSearchInput } from 'src/helpers/base-search.input';
import { PrismaService } from 'src/share_modules/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createPatientDto: CreatePatientDto) {
    try {
      const response = await this.prismaService.patient.create({
        data: createPatientDto,
      });
      return new BaseOutput<patient>({ ...response }, '');
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findAll(input: BaseSearchInput) {
    try {
      const response = await this.prismaService.patient.findMany({
        where: {
          fullName: {
            contains: input.search_text,
            mode: 'insensitive',
          },
        },
      });
      return new BaseOutput<patient[]>(response, '');
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findOne(id: string) {
    try {
      const response = await this.prismaService.patient.findFirstOrThrow({
        where: { id },
      });
      return new BaseOutput<patient>({ ...response }, '');
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async update(id: string, updatePatientDto: UpdatePatientDto) {
    try {
      await this.prismaService.patient.findFirstOrThrow({
        where: { id },
      });
      const response = await this.prismaService.patient.update({
        where: { id },
        data: updatePatientDto,
      });
      return new BaseOutput<patient>({ ...response }, '');
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
