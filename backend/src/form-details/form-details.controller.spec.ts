import { Test, TestingModule } from '@nestjs/testing';
import { FormDetailsController } from './form-details.controller';

describe('FormDetailsController', () => {
  let controller: FormDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormDetailsController],
    }).compile();

    controller = module.get<FormDetailsController>(FormDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
