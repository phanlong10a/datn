import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { BaseSearchInput } from 'src/helpers/base-search.input';

@Controller('/patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  async create(@Body() createPatientDto: CreatePatientDto) {
    return await this.patientService.create(createPatientDto);
  }

  @Post('/list')
  async findAll(@Body() input: BaseSearchInput) {
    return await this.patientService.findAll(input);
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.patientService.findOne(id);
  }

  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    return await this.patientService.update(id, updatePatientDto);
  }
}
