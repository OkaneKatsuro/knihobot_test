import { Controller, Get, Query, NotFoundException } from '@nestjs/common';
import { MockPriceService } from './mock-price.service';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

function cleanIsbn(isbn: string): string {
  return isbn.replace(/[-\s]/g, '');
}

function isValidIsbn10(isbn: string): boolean {
  if (!/^\d{9}[\dX]$/.test(isbn)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += (i + 1) * parseInt(isbn[i]);
  sum += isbn[9] === 'X' ? 10 * 10 : 10 * parseInt(isbn[9]);
  return sum % 11 === 0;
}

function isValidIsbn13(isbn: string): boolean {
  if (!/^\d{13}$/.test(isbn)) return false;
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += parseInt(isbn[i]) * (i % 2 === 0 ? 1 : 3);
  const check = (10 - (sum % 10)) % 10;
  return check === parseInt(isbn[12]);
}

function toIsbn13(isbn10: string): string | null {
  if (!/^\d{9}[\dX]$/.test(isbn10)) return null;
  let isbn = '978' + isbn10.substr(0, 9);
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += parseInt(isbn[i]) * (i % 2 === 0 ? 1 : 3);
  let check = (10 - (sum % 10)) % 10;
  return isbn + check.toString();
}

class MockPriceResponseDto {
  isbn: string;
  price: number;
}

@ApiTags('mock-price')
@Controller('mock-price')
export class MockPriceController {
  constructor(private readonly mockPriceService: MockPriceService) {}

  @Get()
  @ApiQuery({ name: 'isbn', required: true, description: 'ISBN-10 nebo ISBN-13 knihy (s pomlčkami nebo bez)' })
  @ApiResponse({ status: 200, description: 'Price found', type: MockPriceResponseDto })
  @ApiResponse({ status: 404, description: 'Price not found for this ISBN' })
  async getPrice(@Query('isbn') isbn: string) {
    const clean = cleanIsbn(isbn);
    let isbn13: string | null = null;
    if (clean.length === 13 && isValidIsbn13(clean)) {
      isbn13 = clean;
    } else if (clean.length === 10 && isValidIsbn10(clean)) {
      isbn13 = toIsbn13(clean);
      if (!isbn13) {
        throw new NotFoundException('Price not found for this ISBN');
      }
    } else {
      throw new NotFoundException('Price not found for this ISBN');
    }
    const price = this.mockPriceService.getPriceForIsbn(isbn13);
    if (price === null) {
      throw new NotFoundException('Price not found for this ISBN');
    }
    return { isbn: isbn13, price };
  }
}
