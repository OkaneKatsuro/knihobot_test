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
exports.MockPriceController = void 0;
const common_1 = require("@nestjs/common");
const mock_price_service_1 = require("./mock-price.service");
const swagger_1 = require("@nestjs/swagger");
function cleanIsbn(isbn) {
    return isbn.replace(/[-\s]/g, '');
}
function isValidIsbn10(isbn) {
    if (!/^\d{9}[\dX]$/.test(isbn))
        return false;
    let sum = 0;
    for (let i = 0; i < 9; i++)
        sum += (i + 1) * parseInt(isbn[i]);
    sum += isbn[9] === 'X' ? 10 * 10 : 10 * parseInt(isbn[9]);
    return sum % 11 === 0;
}
function isValidIsbn13(isbn) {
    if (!/^\d{13}$/.test(isbn))
        return false;
    let sum = 0;
    for (let i = 0; i < 12; i++)
        sum += parseInt(isbn[i]) * (i % 2 === 0 ? 1 : 3);
    const check = (10 - (sum % 10)) % 10;
    return check === parseInt(isbn[12]);
}
function toIsbn13(isbn10) {
    if (!/^\d{9}[\dX]$/.test(isbn10))
        return null;
    let isbn = '978' + isbn10.substr(0, 9);
    let sum = 0;
    for (let i = 0; i < 12; i++)
        sum += parseInt(isbn[i]) * (i % 2 === 0 ? 1 : 3);
    let check = (10 - (sum % 10)) % 10;
    return isbn + check.toString();
}
class MockPriceResponseDto {
    isbn;
    price;
}
let MockPriceController = class MockPriceController {
    mockPriceService;
    constructor(mockPriceService) {
        this.mockPriceService = mockPriceService;
    }
    async getPrice(isbn) {
        const clean = cleanIsbn(isbn);
        let isbn13 = null;
        if (clean.length === 13 && isValidIsbn13(clean)) {
            isbn13 = clean;
        }
        else if (clean.length === 10 && isValidIsbn10(clean)) {
            isbn13 = toIsbn13(clean);
            if (!isbn13) {
                throw new common_1.NotFoundException('Price not found for this ISBN');
            }
        }
        else {
            throw new common_1.NotFoundException('Price not found for this ISBN');
        }
        const price = this.mockPriceService.getPriceForIsbn(isbn13);
        if (price === null) {
            throw new common_1.NotFoundException('Price not found for this ISBN');
        }
        return { isbn: isbn13, price };
    }
};
exports.MockPriceController = MockPriceController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiQuery)({ name: 'isbn', required: true, description: 'ISBN-10 nebo ISBN-13 knihy (s pomlčkami nebo bez)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Price found', type: MockPriceResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Price not found for this ISBN' }),
    __param(0, (0, common_1.Query)('isbn')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MockPriceController.prototype, "getPrice", null);
exports.MockPriceController = MockPriceController = __decorate([
    (0, swagger_1.ApiTags)('mock-price'),
    (0, common_1.Controller)('mock-price'),
    __metadata("design:paramtypes", [mock_price_service_1.MockPriceService])
], MockPriceController);
//# sourceMappingURL=mock-price.controller.js.map