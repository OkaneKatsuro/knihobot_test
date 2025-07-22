export declare class BooksService {
    addBook(isbn: string, condition: 'new' | 'as_new' | 'damaged'): Promise<{
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
