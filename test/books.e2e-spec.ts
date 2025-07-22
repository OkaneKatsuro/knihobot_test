import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('BooksController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should add book and return 200 if all data present', async () => {
    const isbn = '9780140328721'; // валидный, mock-price вернет цену
    const res = await request(app.getHttpServer())
      .post('/books')
      .send({ isbn, condition: 'new' })
      .expect(200);
    expect(res.body.data).toHaveProperty('isbn10');
    expect(res.body.data).toHaveProperty('isbn13');
    expect(res.body.data).toHaveProperty('price');
    expect(res.body.data).toHaveProperty('title');
  });

  it('should return 400 for invalid ISBN', async () => {
    await request(app.getHttpServer())
      .post('/books')
      .send({ isbn: '1234567890', condition: 'new' })
      .expect(400);
  });

  it('should return 202 if price or title is missing', async () => {
    const isbn = '9780140328722'; // mock-price вернет 404
    const res = await request(app.getHttpServer())
      .post('/books')
      .send({ isbn, condition: 'damaged' })
      .expect(202);
    expect(res.body.data).toHaveProperty('isbn10');
    expect(res.body.data).toHaveProperty('isbn13');
    // price или title может быть null
    expect(res.body.data.price === null || res.body.data.title === null).toBe(true);
  });
}); 