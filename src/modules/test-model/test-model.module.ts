import { Module } from '@nestjs/common';
import { TestModelService } from './test-model.service';
import { TestModelController } from './test-model.controller';

@Module({
  controllers: [TestModelController],
  providers: [TestModelService]
})
export class TestModelModule {}
