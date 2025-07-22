import { Injectable } from '@nestjs/common';

@Injectable()
export class MockPriceService {
  getPriceForIsbn(isbn: string): number | null {
    const cleanIsbn = isbn.replace(/[-\s]/g, '');
    let hash = 5381;
    for (let i = 0; i < cleanIsbn.length; i++) {
      hash = ((hash << 5) + hash) + cleanIsbn.charCodeAt(i);
      hash = hash & 0x7fffffff;
    }
    if (hash % 2 === 0) {
      return null;
    }
    const price = 10 + (hash % (5000 - 10 + 1));
    return price;
  }
}
