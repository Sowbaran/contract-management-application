import { Test, TestingModule } from '@nestjs/testing';
import { FormApprovalController } from './form-approval.controller';

describe('FormApprovalController', () => {
  let controller: FormApprovalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormApprovalController],
    }).compile();

    controller = module.get<FormApprovalController>(FormApprovalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
