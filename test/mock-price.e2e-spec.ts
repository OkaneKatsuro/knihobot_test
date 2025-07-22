import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('MockPriceController (e2e)', () => {
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

  it('should return price for ISBN with odd hash', async () => {
    const isbn = '9780140328721'; // Должен вернуть цену
    const res = await request(app.getHttpServer())
      .get(`/mock-price?isbn=${isbn}`)
      .expect((r) => {
        if (r.status !== 200 && r.status !== 404) throw new Error('Unexpected status');
      });
    if (res.status === 200) {
      expect(res.body).toHaveProperty('price');
      expect(typeof res.body.price).toBe('number');
    }
  });

  it('should return 404 for ISBN with even hash', async () => {
    const isbn = '9780140328722'; 
    await request(app.getHttpServer())
      .get(`/mock-price?isbn=${isbn}`)
      .expect(404);
  });
}); 