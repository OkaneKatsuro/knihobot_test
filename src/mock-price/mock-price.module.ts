import { Module } from '@nestjs/common';
import { MockPriceController } from './mock-price.controller';
import { MockPriceService } from './mock-price.service';

@Module({
  controllers: [MockPriceController],
  providers: [MockPriceService]
})
export class MockPriceModule {}
