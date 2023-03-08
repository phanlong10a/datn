import { BadRequestException, Injectable } from '@nestjs/common';
import { patient } from '@prisma/client';
import { BaseOutput } from 'src/helpers/base-output';
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

  findAll() {
    return `This action returns all patient`;
  }

  findOne(id: number) {
    return `This action returns a #${id} patient`;
  }

  update(id: number, updatePatientDto: UpdatePatientDto) {
    return `This action updates a #${id} patient`;
  }

  remove(id: number) {
    return `This action removes a #${id} patient`;
  }
}
