import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';

const CONDITION_COEFFICIENTS = {
  new: 1,
  as_new: 0.8,
  damaged: 0.5,
};

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

function toIsbn10(isbn13: string): string | null {
  if (!/^97[89]\d{10}$/.test(isbn13)) return null;
  let isbn = isbn13.substr(3, 9);
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += (10 - i) * parseInt(isbn[i]);
  let check = 11 - (sum % 11);
  let checkChar = check === 10 ? 'X' : check === 11 ? '0' : check.toString();
  return isbn + checkChar;
}

function toIsbn13(isbn10: string): string | null {
  if (!/^\d{9}[\dX]$/.test(isbn10)) return null;
  let isbn = '978' + isbn10.substr(0, 9);
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += parseInt(isbn[i]) * (i % 2 === 0 ? 1 : 3);
  let check = (10 - (sum % 10)) % 10;
  return isbn + check.toString();
}

@Injectable()
export class BooksService {
  async addBook(isbn: string, condition: 'new' | 'as_new' | 'damaged') {
    const clean = cleanIsbn(isbn);
    let isbn10: string | null = null;
    let isbn13: string | null = null;
    if (clean.length === 10 && isValidIsbn10(clean)) {
      isbn10 = clean;
      isbn13 = toIsbn13(clean);
    } else if (clean.length === 13 && isValidIsbn13(clean)) {
      isbn13 = clean;
      isbn10 = toIsbn10(clean);
    } else {
      throw new BadRequestException('Invalid ISBN');
    }
    let price: number | null = null;
    try {
      const resp = await axios.get(`http://localhost:3000/mock-price?isbn=${isbn13}`);
      price = resp.data.price;
    } catch (e) {
      price = null;
    }
    let finalPrice: number | null = null;
    if (price !== null) {
      finalPrice = Math.round(price * CONDITION_COEFFICIENTS[condition]);
    }
    let title: string | null = null;
    try {
      const resp = await axios.get(`https://openlibrary.org/isbn/${isbn13}.json`);
      title = resp.data.title || null;
    } catch (e) {
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
    } else {
      return { status: 202, data };
    }
  }
}
