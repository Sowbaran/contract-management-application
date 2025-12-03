import { Test, TestingModule } from '@nestjs/testing';
import { FormModuleService } from './form-module.service';

describe('FormModuleService', () => {
  let service: FormModuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormModuleService],
    }).compile();

    service = module.get<FormModuleService>(FormModuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
