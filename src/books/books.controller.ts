import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { BooksService } from './books.service';
import { ApiBody, ApiResponse, ApiTags, ApiOperation, ApiBadRequestResponse } from '@nestjs/swagger';

class AddBookRequestDto {
  /**
   * ISBN knihy (ISBN-10 nebo ISBN-13, s pomlčkami nebo bez)
   * @example "978-0140328721"
   */
  isbn: string;
  /**
   * Stav knihy
   * @example "as_new"
   */
  condition: 'new' | 'as_new' | 'damaged';
}

class AddBookResponseDto {
  /**
   * ISBN-10
   * @example "0140328726"
   */
  isbn10: string;
  /**
   * ISBN-13
   * @example "9780140328721"
   */
  isbn13: string;
  /**
   * Stav knihy
   * @example "damaged"
   */
  condition: 'new' | 'as_new' | 'damaged';
  /**
   * Výsledná cena (nebo null pokud nebyla určena)
   * @example 320
   */
  price: number | null;
  /**
   * Název knihy (nebo null pokud nebyl určen)
   * @example "Matilda"
   */
  title: string | null;
}

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiOperation({ summary: 'Přidání nové knihy na eshop', description: 'Validuje ISBN, získá cenu z mock-price a název z OpenLibrary. Pokud je vše úspěšné, vystaví knihu na eshop (200), jinak čeká na manuální dokončení (202).' })
  @ApiBody({ type: AddBookRequestDto, examples: {
    valid: {
      summary: 'Validní požadavek',
      value: { isbn: '978-0140328721', condition: 'as_new' }
    },
    invalid: {
      summary: 'Nevalidní ISBN',
      value: { isbn: '123', condition: 'new' }
    }
  }})
  @ApiResponse({ status: 200, description: 'Kniha vystavena na eshop', type: AddBookResponseDto, examples: {
    success: {
      summary: 'Kniha vystavena',
      value: { isbn10: '0140328726', isbn13: '9780140328721', condition: 'as_new', price: 320, title: 'Matilda' }
    }
  }})
  @ApiResponse({ status: 202, description: 'Kniha čeká na manuální dokončení', type: AddBookResponseDto, examples: {
    manual: {
      summary: 'Chybí cena nebo název',
      value: { isbn10: '0140328726', isbn13: '9780140328721', condition: 'damaged', price: null, title: null }
    }
  }})
  @ApiBadRequestResponse({ description: 'Nevalidní ISBN nebo chybějící pole', schema: { example: { statusCode: 400, message: 'Invalid ISBN', error: 'Bad Request' } } })
  async addBook(@Body() body: AddBookRequestDto) {
    if (!body.isbn || !body.condition) {
      throw new BadRequestException('isbn and condition are required');
    }
    return this.booksService.addBook(body.isbn, body.condition);
  }
}
