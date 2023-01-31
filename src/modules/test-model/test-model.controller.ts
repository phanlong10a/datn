import { Body, Controller, Post } from '@nestjs/common';
import { TestModelService } from './test-model.service';

@Controller('/test-models')
export class TestModelController {
  constructor(
    private readonly testModelService: TestModelService,
  ) { }

  @Post('/create')
  async createModel(@Body() input:any){
    const response = await this.testModelService.create(input)
    return response
  }

}
