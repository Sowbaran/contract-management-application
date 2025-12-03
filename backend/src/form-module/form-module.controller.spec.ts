import { Test, TestingModule } from '@nestjs/testing';
import { FormModuleController } from './form-module.controller';

describe('FormModuleController', () => {
  let controller: FormModuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormModuleController],
    }).compile();

    controller = module.get<FormModuleController>(FormModuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
