"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const CONDITION_COEFFICIENTS = {
    new: 1,
    as_new: 0.8,
    damaged: 0.5,
};
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
function toIsbn10(isbn13) {
    if (!/^97[89]\d{10}$/.test(isbn13))
        return null;
    let isbn = isbn13.substr(3, 9);
    let sum = 0;
    for (let i = 0; i < 9; i++)
        sum += (10 - i) * parseInt(isbn[i]);
    let check = 11 - (sum % 11);
    let checkChar = check === 10 ? 'X' : check === 11 ? '0' : check.toString();
    return isbn + checkChar;
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
let BooksService = class BooksService {
    async addBook(isbn, condition) {
        const clean = cleanIsbn(isbn);
        let isbn10 = null;
        let isbn13 = null;
        if (clean.length === 10 && isValidIsbn10(clean)) {
            isbn10 = clean;
            isbn13 = toIsbn13(clean);
        }
        else if (clean.length === 13 && isValidIsbn13(clean)) {
            isbn13 = clean;
            isbn10 = toIsbn10(clean);
        }
        else {
            throw new common_1.BadRequestException('Invalid ISBN');
        }
        let price = null;
        try {
            const resp = await axios_1.default.get(`http://localhost:3000/mock-price?isbn=${isbn13}`);
            price = resp.data.price;
        }
        catch (e) {
            price = null;
        }
        let finalPrice = null;
        if (price !== null) {
            finalPrice = Math.round(price * CONDITION_COEFFICIENTS[condition]);
        }
        let title = null;
        try {
            const resp = await axios_1.default.get(`https://openlibrary.org/isbn/${isbn13}.json`);
            title = resp.data.title || null;
        }
        catch (e) {
            title = null;
        }
        const data = {
            isbn10,
            isbn13,
            condition,
            price: finalPrice,
            title,
        };
        if (finalPrice !== null && title) {
            return { status: 200, data };
        }
        else {
            return { status: 202, data };
        }
    }
};
exports.BooksService = BooksService;
exports.BooksService = BooksService = __decorate([
    (0, common_1.Injectable)()
], BooksService);
//# sourceMappingURL=books.service.js.map