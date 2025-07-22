import { Test, TestingModule } from '@nestjs/testing';
import { MockPriceController } from './mock-price.controller';
import { MockPriceService } from './mock-price.service';

describe('MockPriceController', () => {
  let controller: MockPriceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MockPriceController],
      providers: [MockPriceService],
    }).compile();
    controller = module.get<MockPriceController>(MockPriceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return price for valid ISBN-13 with odd hash', async () => {
    const isbn = '9780000000002';
    const result = await controller.getPrice(isbn);
    expect(result).toHaveProperty('isbn', '9780000000002');
    expect(typeof result.price).toBe('number');
    expect(result.price).toBeGreaterThanOrEqual(10);
    expect(result.price).toBeLessThanOrEqual(5000);
  });

  it('should return price for valid ISBN-10 (converted to ISBN-13)', async () => {
    const isbn10 = '0000000000'; 
    const result = await controller.getPrice(isbn10);
    expect(result).toHaveProperty('isbn', '9780000000002');
    expect(typeof result.price).toBe('number');
    expect(result.price).toBeGreaterThanOrEqual(10);
    expect(result.price).toBeLessThanOrEqual(5000);
  });

  it('should return the same price for ISBN-10 and ISBN-13 of the same book', async () => {
    const isbn13 = '9780000000002';
    const isbn10 = '0000000000';
    const result13 = await controller.getPrice(isbn13);
    const result10 = await controller.getPrice(isbn10);
    expect(result13.price).toBe(result10.price);
    expect(result13.isbn).toBe(result10.isbn);
  });

  it('should return 404 for ISBN with even hash', async () => {
    const isbn = '9780000000001'; // hash % 2 === 0
    await expect(controller.getPrice(isbn)).rejects.toThrow('Price not found for this ISBN');
  });

  it('should return 404 for invalid ISBN (too short)', async () => {
    await expect(controller.getPrice('123')).rejects.toThrow('Price not found for this ISBN');
  });

  it('should return 404 for invalid ISBN (non-numeric)', async () => {
    await expect(controller.getPrice('invalidisbn')).rejects.toThrow('Price not found for this ISBN');
  });

  it('should return 404 for empty ISBN', async () => {
    await expect(controller.getPrice('')).rejects.toThrow('Price not found for this ISBN');
  });

  it('should always return the same price for the same ISBN', async () => {
    const isbn = '9780000000002';
    const result1 = await controller.getPrice(isbn);
    const result2 = await controller.getPrice(isbn);
    expect(result1.price).toBe(result2.price);
  });

  it('should return price for about 50% of random ISBNs', async () => {
    let found = 0;
    let notFound = 0;
    for (let i = 1; i <= 20; i++) {
      const isbn = '97800000000' + (i < 10 ? '0' : '') + i;
      try {
        await controller.getPrice(isbn);
        found++;
      } catch {
        notFound++;
      }
    }
    
    expect(found).toBeGreaterThanOrEqual(6);
    expect(found).toBeLessThanOrEqual(14);
  });
});
