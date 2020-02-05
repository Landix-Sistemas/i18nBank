import { Test, TestingModule } from '@nestjs/testing';
import { WatsonService } from './watson.service';

describe('WatsonService', () => {
  let service: WatsonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WatsonService],
    }).compile();

    service = module.get<WatsonService>(WatsonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
