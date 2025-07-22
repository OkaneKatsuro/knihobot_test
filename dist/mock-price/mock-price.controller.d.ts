import { MockPriceService } from './mock-price.service';
export declare class MockPriceController {
    private readonly mockPriceService;
    constructor(mockPriceService: MockPriceService);
    getPrice(isbn: string): Promise<{
        isbn: string;
        price: number;
    }>;
}
