import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';


jest.setTimeout(1000 * 100);
describe('SuperAdminUsersController (e2e)', () => {
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

  describe('DELETE ALL DATA', () => {
    it('should delete all data, status 204', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/testing/all-data',
      );
      expect(response.status).toBe(204);
    });
    it('should return pagination and empty items array', async () => {
      const emptyuserView = {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: [],
      };
      await request(app.getHttpServer())
        .get('/sa/users')
        .set('Authorization', 'Basic ' + Buffer.from('admin:qwerty').toString('base64')) // Basic auth
        .expect(200, emptyuserView);
    });
  });

  it('should create a user (POST /sa/users)', async () => {
    const userDto = {
      login: 'testuser',
      password: 'TestPassword123!',
      email: 'testuser@example.com',
    };
      const response = await request(app.getHttpServer())
        .post('/sa/users')
        .send(userDto)
        .set('Authorization', 'Basic ' + Buffer.from('admin:qwerty').toString('base64')) // Basic auth
        .expect(HttpStatus.CREATED);

      console.log(response.body);  // Выводим ответ сервера в консоль

      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          login: 'testuser',
          email: 'testuser@example.com',
        })
      );
    });
  });
