import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { BaseSearchInput } from 'src/helpers/base-search.input';
import { BaseSearchResponse } from 'src/helpers/base-search.output';
import { CreatePositionInput } from './dto/create-position.dto';
import { PositionDto } from './dto/position.dto';
import { PositionService } from './position.service';

@Controller('/')
export class PositionController {
  constructor(private readonly positionService: PositionService) { }

  @Post('api/position/list-position')
  async getList(@Body() input: BaseSearchInput): Promise<BaseSearchResponse<PositionDto>> {
    return await this.positionService.getList(input)
  }

  @Post('api/position/create-position')
  async create(@Body() input: CreatePositionInput): Promise<string> {
    return await this.positionService.create(input)
  }

  @Put('api/position/update-position/:id')
  async update(@Body() input: CreatePositionInput, @Param('id') id: string): Promise<string> {
    return await this.positionService.update(input, id)
  }

  @Delete('api/position/delete-position/:id')
  async delete(@Param('id') id: string): Promise<string> {
    return await this.positionService.delete(id)
  }

}
