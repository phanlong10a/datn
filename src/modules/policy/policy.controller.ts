import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { BaseSearchInput } from 'src/helpers/base-search.input';
import { BaseSearchResponse } from 'src/helpers/base-search.output';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { PolicyDto } from './dto/policy.dto';
import { PolicyService } from './policy.service';

@Controller('/')
export class PolicyController {
  constructor(private readonly policyService: PolicyService) { }


  @Post('api/policy/list-policy')
  async getList(@Body() input: BaseSearchInput): Promise<BaseSearchResponse<PolicyDto>> {
    return await this.policyService.getList(input)
  }

  @Post('api/policy/create-policy')
  create(@Body() createDepartmentDto: CreatePolicyDto) {
    return this.policyService.create(createDepartmentDto);
  }


  @Put('api/policy/update-policy/:id')
  async update(@Body() input: CreatePolicyDto, @Param('id') id: string): Promise<string> {
    return await this.policyService.update(input, id)
  }

  @Delete('api/policy/delete-policy/:id')
  async delete(@Param('id') id: string): Promise<string> {
    return await this.policyService.delete(id)
  }


}
