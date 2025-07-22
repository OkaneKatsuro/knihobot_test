"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockPriceService = void 0;
const common_1 = require("@nestjs/common");
let MockPriceService = class MockPriceService {
    getPriceForIsbn(isbn) {
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
};
exports.MockPriceService = MockPriceService;
exports.MockPriceService = MockPriceService = __decorate([
    (0, common_1.Injectable)()
], MockPriceService);
//# sourceMappingURL=mock-price.service.js.map