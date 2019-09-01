import { Test, TestingModule } from '@nestjs/testing';
import { TranslationController } from './translation.controller';

describe('Translation Controller', () => {
  let controller: TranslationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TranslationController],
    }).compile();

    controller = module.get<TranslationController>(TranslationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
