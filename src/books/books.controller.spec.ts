import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { BadRequestException } from '@nestjs/common';

describe('BooksController', () => {
  let controller: BooksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [BooksService],
    }).compile();
    controller = module.get<BooksController>(BooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should add book and return 200 for valid ISBN-13 with price', async () => {
    const body = { isbn: '9780000000002', condition: 'new' as 'new' };
    const result = await controller.addBook(body);
    expect(result.status).toBe(200);
    expect(result.data.isbn13).toBe('9780000000002');
    expect(result.data.condition).toBe('new');
    expect(typeof result.data.price).toBe('number');
  });

  it('should add book and return 200 for valid ISBN-10 with price', async () => {
    const body = { isbn: '0000000000', condition: 'as_new' as 'as_new' };
    const result = await controller.addBook(body);
    expect(result.status).toBe(200);
    expect(result.data.isbn10).toBe('0000000000');
    expect(result.data.condition).toBe('as_new');
    expect(typeof result.data.price).toBe('number');
  });

  it('should return 202 if price is not found', async () => {
    const body = { isbn: '9780000000001', condition: 'damaged' as 'damaged' };
    const result = await controller.addBook(body);
    expect(result.status).toBe(202);
    expect(result.data.price).toBeNull();
  });

  it('should throw BadRequestException for missing fields', async () => {
    await expect(controller.addBook({ isbn: '', condition: 'new' as 'new' })).rejects.toThrow(BadRequestException);
    await expect(controller.addBook({ isbn: '9780000000002', condition: '' as any })).rejects.toThrow(BadRequestException);
    await expect(controller.addBook({} as any)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException for invalid ISBN', async () => {
    await expect(controller.addBook({ isbn: '123', condition: 'new' as 'new' })).rejects.toThrow(BadRequestException);
    await expect(controller.addBook({ isbn: 'invalidisbn', condition: 'as_new' as 'as_new' })).rejects.toThrow(BadRequestException);
  });

  it('should always return the same result for the same ISBN and condition', async () => {
    const body = { isbn: '9780000000002', condition: 'as_new' as 'as_new' };
    const result1 = await controller.addBook(body);
    const result2 = await controller.addBook(body);
    expect(result1.status).toBe(result2.status);
    expect(result1.data.price).toBe(result2.data.price);
    expect(result1.data.isbn13).toBe(result2.data.isbn13);
    expect(result1.data.isbn10).toBe(result2.data.isbn10);
  });
});
