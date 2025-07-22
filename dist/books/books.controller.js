"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksController = void 0;
const common_1 = require("@nestjs/common");
const books_service_1 = require("./books.service");
const swagger_1 = require("@nestjs/swagger");
class AddBookRequestDto {
    isbn;
    condition;
}
class AddBookResponseDto {
    isbn10;
    isbn13;
    condition;
    price;
    title;
}
let BooksController = class BooksController {
    booksService;
    constructor(booksService) {
        this.booksService = booksService;
    }
    async addBook(body) {
        if (!body.isbn || !body.condition) {
            throw new common_1.BadRequestException('isbn and condition are required');
        }
        return this.booksService.addBook(body.isbn, body.condition);
    }
};
exports.BooksController = BooksController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Přidání nové knihy na eshop', description: 'Validuje ISBN, získá cenu z mock-price a název z OpenLibrary. Pokud je vše úspěšné, vystaví knihu na eshop (200), jinak čeká na manuální dokončení (202).' }),
    (0, swagger_1.ApiBody)({ type: AddBookRequestDto, examples: {
            valid: {
                summary: 'Validní požadavek',
                value: { isbn: '978-0140328721', condition: 'as_new' }
            },
            invalid: {
                summary: 'Nevalidní ISBN',
                value: { isbn: '123', condition: 'new' }
            }
        } }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kniha vystavena na eshop', type: AddBookResponseDto, examples: {
            success: {
                summary: 'Kniha vystavena',
                value: { isbn10: '0140328726', isbn13: '9780140328721', condition: 'as_new', price: 320, title: 'Matilda' }
            }
        } }),
    (0, swagger_1.ApiResponse)({ status: 202, description: 'Kniha čeká na manuální dokončení', type: AddBookResponseDto, examples: {
            manual: {
                summary: 'Chybí cena nebo název',
                value: { isbn10: '0140328726', isbn13: '9780140328721', condition: 'damaged', price: null, title: null }
            }
        } }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Nevalidní ISBN nebo chybějící pole', schema: { example: { statusCode: 400, message: 'Invalid ISBN', error: 'Bad Request' } } }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddBookRequestDto]),
    __metadata("design:returntype", Promise)
], BooksController.prototype, "addBook", null);
exports.BooksController = BooksController = __decorate([
    (0, swagger_1.ApiTags)('books'),
    (0, common_1.Controller)('books'),
    __metadata("design:paramtypes", [books_service_1.BooksService])
], BooksController);
//# sourceMappingURL=books.controller.js.map