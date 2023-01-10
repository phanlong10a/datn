import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { BaseSearchInput } from 'src/helpers/base-search.input';
import { BaseSearchResponse } from 'src/helpers/base-search.output';
import { DepartmentService } from './department.service';
import { CreateDepartmentInput } from './dto/create-department.dto';
import { DepartmentDto } from './dto/department.dto';

@Controller('/')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) { }


  @Post('api/department/list_department')
  async getList(@Body() input: BaseSearchInput): Promise<BaseSearchResponse<DepartmentDto>> {
    return await this.departmentService.getList(input)
  }

  @Post('api/department/create')
  create(@Body() createDepartmentDto: CreateDepartmentInput) {
    return this.departmentService.create(createDepartmentDto);
  }


  @Put('api/department/update/:id')
  async update(@Body() input: CreateDepartmentInput, @Param('id') id: string): Promise<string> {
    return await this.departmentService.update(input, id)
  }

  @Delete('api/department/delete/:id')
  async delete(@Param('id') id: string): Promise<string> {
    return await this.departmentService.delete(id)
  }
}
