import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';

describe('BooksService', () => {
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BooksService],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return 200 and all data for valid ISBN-13 with price and title', async () => {
    const isbn = '9780000000002'; 
    const condition = 'as_new';
    const result = await service.addBook(isbn, condition);
    expect(result.status).toBe(200);
    expect(result.data.isbn13).toBe('9780000000002');
    expect(result.data.isbn10).toBe('0000000000');
    expect(result.data.condition).toBe(condition);
    expect(typeof result.data.price).toBe('number');
    expect(result.data).toHaveProperty('title');
  });

  it('should return 200 and all data for valid ISBN-10 with price and title', async () => {
    const isbn10 = '0000000000'; 
    const condition = 'damaged';
    const result = await service.addBook(isbn10, condition);
    expect(result.status).toBe(200);
    expect(result.data.isbn13).toBe('9780000000002');
    expect(result.data.isbn10).toBe('0000000000');
    expect(result.data.condition).toBe(condition);
    expect(typeof result.data.price).toBe('number');
    expect(result.data).toHaveProperty('title');
  });

  it('should return 202 if price is not found', async () => {
    const isbn = '9780000000001'; 
    const result = await service.addBook(isbn, 'new');
    expect(result.status).toBe(202);
    expect(result.data.price).toBeNull();
  });

  it('should return 202 if title is not found', async () => {
    
    const isbn = '9780000000002';
   const result = await service.addBook(isbn, 'new');
    if (result.data.title === null) {
      expect(result.status).toBe(202);
    } else {
      expect(result.status).toBe(200);
    }
  });

  it('should throw BadRequestException for invalid ISBN', async () => {
    await expect(service.addBook('123', 'new')).rejects.toThrow('Invalid ISBN');
    await expect(service.addBook('invalidisbn', 'as_new')).rejects.toThrow('Invalid ISBN');
    await expect(service.addBook('', 'damaged')).rejects.toThrow('Invalid ISBN');
  });

  it('should calculate price with correct coefficient', async () => {
    const isbn = '9780000000002';
    const baseResult = await service.addBook(isbn, 'new');
    if (baseResult.data.price === null) {
      throw new Error('Base price should not be null for this test ISBN');
    }
    const asNewResult = await service.addBook(isbn, 'as_new');
    const damagedResult = await service.addBook(isbn, 'damaged');
    expect(asNewResult.data.price).toBe(Math.round(baseResult.data.price * 0.8));
    expect(damagedResult.data.price).toBe(Math.round(baseResult.data.price * 0.5));
  });

  it('should always return the same result for the same ISBN and condition', async () => {
    const isbn = '9780000000002';
    const condition = 'as_new';
    const result1 = await service.addBook(isbn, condition);
    const result2 = await service.addBook(isbn, condition);
    expect(result1.status).toBe(result2.status);
    expect(result1.data.price).toBe(result2.data.price);
    expect(result1.data.isbn13).toBe(result2.data.isbn13);
    expect(result1.data.isbn10).toBe(result2.data.isbn10);
  });
});
