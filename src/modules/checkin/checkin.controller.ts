import { Body, Controller, Get, Post } from '@nestjs/common';
import { Auth, CurrentUser } from 'src/decorators/Authorization';
import { BaseSearchResponse } from 'src/helpers/base-search.output';
import { CheckinService } from './checkin.service';
import { CheckinDto } from './dto/checkin.dto';
import { SearchCheckinInput } from './dto/search-checkin.dto';
import { SearchSalaryInput } from './dto/search-salary.input';

@Controller('/')
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) { }

  @Auth()
  @Get('api/timekeeping/get-keeping')
  async getCheckin(@CurrentUser('id') id: string): Promise<CheckinDto> {
    return await this.checkinService.getCheckin(id);
  }

  @Auth()
  @Post('api/timekeeping/entry')
  async checkin(@CurrentUser('id') id: string): Promise<string> {
    return await this.checkinService.checkin(id);
  }

  @Auth()
  @Post('api/timekeeping/out')
  async checkout(@CurrentUser('id') id: string): Promise<string> {
    return await this.checkinService.checkout(id);
  }


  @Auth()
  @Post('api/dot/dot_information')
  async getListCheckin(@Body() input: SearchCheckinInput): Promise<BaseSearchResponse<any>> {
    return await this.checkinService.getListCheckin(input);
  }

  @Auth()
  @Post('api/dot/list-salary')
  async listSalary(@Body() input: SearchSalaryInput): Promise<BaseSearchResponse<any>> {
    return await this.checkinService.getListSalary(input);
  }
  @Auth()
  @Post('api/dot/salary')
  async salary(@Body() input: SearchSalaryInput): Promise<BaseSearchResponse<any>> {
    return await this.checkinService.getSalary(input);
  }

  @Auth()
  @Post('api/dot/export-excel')
  async exportExcel(@Body() input: SearchSalaryInput): Promise<any> {
    return await this.checkinService.toExcel(input);
  }
  @Auth()
  @Post('api/dot/export-salary-bill')
  async exportExcelBill(@Body() input: SearchSalaryInput): Promise<any> {
    return await this.checkinService.toBillExcel(input);
  }
}
