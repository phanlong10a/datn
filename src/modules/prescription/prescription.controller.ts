import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PrescriptionService } from './prescription.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { BaseSearchInput } from 'src/helpers/base-search.input';

@Controller('/prescription/')
export class PrescriptionController {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  @Post()
  async create(@Body() createPrescriptionDto: CreatePrescriptionDto) {
    return await this.prescriptionService.create(createPrescriptionDto);
  }

  @Post('list')
  async findAll(@Body() input: BaseSearchInput) {
    return await this.prescriptionService.findAll(input);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.prescriptionService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePrescriptionDto: UpdatePrescriptionDto,
  ) {
    return await this.prescriptionService.update(id, updatePrescriptionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.prescriptionService.remove(id);
  }
}
