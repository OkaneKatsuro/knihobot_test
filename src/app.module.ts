import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MockPriceModule } from './mock-price/mock-price.module';
import { BooksModule } from './books/books.module';

@Module({
  imports: [MockPriceModule, BooksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
