import { Test, TestingModule } from '@nestjs/testing';
import { WatsonController } from './watson.controller';

describe('Watson Controller', () => {
  let controller: WatsonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WatsonController],
    }).compile();

    controller = module.get<WatsonController>(WatsonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
