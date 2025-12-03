import { Test, TestingModule } from '@nestjs/testing';
import { DocumentHandlerController } from './document-handler.controller';

describe('DocumentUploadController', () => {
  let controller: DocumentHandlerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentHandlerController],
    }).compile();

    controller = module.get<DocumentHandlerController>(DocumentHandlerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
