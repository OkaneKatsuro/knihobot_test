import { Test, TestingModule } from '@nestjs/testing';
import { MockPriceService } from './mock-price.service';

describe('MockPriceService', () => {
  let service: MockPriceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MockPriceService],
    }).compile();

    service = module.get<MockPriceService>(MockPriceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
