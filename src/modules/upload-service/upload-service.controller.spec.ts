import { Test, TestingModule } from '@nestjs/testing';
import { UploadServiceController } from './upload-service.controller';

describe('UploadServiceController', () => {
  let controller: UploadServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadServiceController],
    }).compile();

    controller = module.get<UploadServiceController>(UploadServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
