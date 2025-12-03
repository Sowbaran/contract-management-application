import { Test, TestingModule } from '@nestjs/testing';
import { FormApprovalService } from './form-approval.service';

describe('FormApprovalService', () => {
  let service: FormApprovalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormApprovalService],
    }).compile();

    service = module.get<FormApprovalService>(FormApprovalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
