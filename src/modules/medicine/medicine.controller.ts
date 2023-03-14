import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BaseSearchInput } from 'src/helpers/base-search.input';
import { medicineDto } from './dto/medicine.dto';
import { MedicineService } from './medicine.service';

@Controller('/medicine')
export class MedicineController {
  constructor(private readonly medicineService: MedicineService) {}

  @Post()
  async createMedicine(@Body() input: medicineDto) {
    console.log(
      '🚀 ~ file: medicine.controller.ts:20 ~ MedicineController ~ createMedicine ~ input:',
      input,
    );
    return await this.medicineService.createMedicine(input);
  }

  @Put('/:id')
  async updateMedicine(@Body() input: medicineDto, @Param('id') id: string) {
    return await this.medicineService.updateMedicine(input, id);
  }

  @Post('/list')
  async getList(@Body() input: BaseSearchInput) {
    return await this.medicineService.getListMedicine(input);
  }

  @Get('/:id')
  async getMedicine(@Param('id') id: string) {
    return await this.medicineService.getMedicine(id);
  }

  @Delete('/:id')
  async deleteMedicine(@Param('id') id: string) {
    return await this.medicineService.deleteMedicine(id);
  }
}
