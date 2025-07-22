import { BooksService } from './books.service';
declare class AddBookRequestDto {
    isbn: string;
    condition: 'new' | 'as_new' | 'damaged';
}
export declare class BooksController {
    private readonly booksService;
    constructor(booksService: BooksService);
    addBook(body: AddBookRequestDto): Promise<{
        status: number;
        data: {
            isbn10: string | null;
            isbn13: string | null;
            condition: "new" | "as_new" | "damaged";
            price: number | null;
            title: string | null;
        };
    }>;
}
export {};
