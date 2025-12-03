import { Test, TestingModule } from '@nestjs/testing';
import { DocumentHandlerService } from './document-handler.service';

describe('DocumrntUploadService', () => {
  let service: DocumentHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentHandlerService],
    }).compile();

    service = module.get<DocumentHandlerService>(DocumentHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
